// Third party modules
import { firestore } from 'firebase-admin';

// Dashboard hub firebase functions mappers/models
import { GitHubUserInput, GitHubUserMapper, GitHubUserModel } from './user.mapper';

export interface GitHubIssueInput {
  id: string;
  html_url: string;
  state: string;
  title: string;
  number: number;
  body: string;
  user: GitHubUserInput;
  assignees: GitHubUserInput[];
  created_at: firestore.Timestamp;
  updated_at: firestore.Timestamp;
}

export interface GitHubIssueModel {
  uid: string;
  url: string;
  state: string;
  title: string;
  number: number;
  description: string;
  owner: GitHubUserModel;
  assignees: GitHubUserModel[];
  createdOn: firestore.Timestamp;
  updatedOn: firestore.Timestamp;
}

export class GitHubIssueMapper {
  static import(input: GitHubIssueInput): GitHubIssueModel {
    return {
      uid: input.id,
      url: input.html_url,
      state: input.state,
      title: input.title,
      number: input.number,
      description: input.body,
      owner: GitHubUserMapper.import(input.user),
      assignees: input.assignees.map((assignee: GitHubUserInput) => GitHubUserMapper.import(assignee)),
      createdOn: input.created_at,
      updatedOn: input.updated_at,
    };
  }
}
