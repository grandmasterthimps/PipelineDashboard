// Third party modules
import { firestore } from 'firebase-admin';

import {
  GitHubContributorInput, GitHubContributorMapper,
  GitHubEventInput, GitHubEventMapper,
  GitHubIssueInput, GitHubIssueMapper,
  GitHubMilestoneInput, GitHubMilestoneMapper,
  GitHubPullRequestInput, GitHubPullRequestMapper,
  GitHubReleaseInput, GitHubReleaseMapper,
  GitHubRepositoryInput, GitHubRepositoryMapper,
  GitHubRepositoryModel,
  GitHubRepositoryWebhookModel,
} from '../mappers/github/index.mapper';
import { FirebaseAdmin } from './../client/firebase-admin';
import { GitHubClient } from './../client/github';
import { Logger } from './../client/logger';
import { getWebhook } from './create-git-webhook-repository';

export interface RepositoryInfoInput {
  token: string;
  fullName: string;
}

export const getRepositoryInfo: any = async (token: string, fullName: string) => {
  let data: [
    GitHubRepositoryInput,
    GitHubPullRequestInput[],
    GitHubEventInput[],
    GitHubReleaseInput[],
    GitHubIssueInput[],
    GitHubContributorInput[],
    GitHubMilestoneInput[],
    GitHubRepositoryWebhookModel?,
  ];
  let mappedData: GitHubRepositoryModel;

  try {
    data = await Promise.all([
      GitHubClient<GitHubRepositoryInput>(`/repos/${fullName}`, token),
      GitHubClient<GitHubPullRequestInput[]>(`/repos/${fullName}/pulls?state=open`, token),
      GitHubClient<GitHubEventInput[]>(`/repos/${fullName}/events`, token),
      GitHubClient<GitHubReleaseInput[]>(`/repos/${fullName}/releases`, token),
      GitHubClient<GitHubIssueInput[]>(`/repos/${fullName}/issues`, token),
      GitHubClient<GitHubContributorInput[]>(`/repos/${fullName}/stats/contributors`, token),
      GitHubClient<GitHubMilestoneInput[]>(`/repos/${fullName}/milestones`, token),
    ]);
    mappedData = {
      ...GitHubRepositoryMapper.import(data[0], 'all'),
      pullRequests: data[1] ? data[1].map((pullrequest: GitHubPullRequestInput) => GitHubPullRequestMapper.import(pullrequest)) : [],
      events: data[2] ? data[2].map((event: GitHubEventInput) => GitHubEventMapper.import(event)) : [],
      releases: data[3] ? GitHubReleaseMapper.sortReleaseList(data[3].map((release: GitHubReleaseInput) => GitHubReleaseMapper.import(release))) : [],
      issues: Array.isArray(data[4]) ? data[4].map((issue: GitHubIssueInput) => GitHubIssueMapper.import(issue)) : [],
      contributors: Array.isArray(data[5]) ? data[5].map((contributor: GitHubContributorInput) => GitHubContributorMapper.import(contributor)) : [],
      milestones: Array.isArray(data[6]) ? data[6].map((milestone: GitHubMilestoneInput) => GitHubMilestoneMapper.import(milestone)) : [],
      updatedAt: firestore.Timestamp.fromDate(new Date()),
    };
  } catch (error) {
    Logger.error(error, [`Repository Path: ${fullName}`]);
    throw new Error(error);
  }

  try {
    mappedData.webhook = await getWebhook(fullName, token);
  } catch (error) {
    Logger.error(error, ['Webhook failed', `Repository Path: ${fullName}`]);
  }

  Logger.info({
    repository: fullName,
    imported: {
      pullRequests: mappedData && mappedData.pullRequests.length || 0,
      events: mappedData && mappedData.events.length || 0,
      releases: mappedData && mappedData.releases.length || 0,
      issues: mappedData && mappedData.issues.length || 0,
      milestones: mappedData && mappedData.milestones.length || 0,
      webhook: mappedData && mappedData.webhook,
      updatedAt: mappedData && mappedData.updatedAt,
    },
  });

  await FirebaseAdmin
    .firestore()
    .collection('repositories')
    .doc(GitHubRepositoryMapper.fullNameToUid(fullName))
    .set(mappedData, { merge: true });

  return mappedData;
};
