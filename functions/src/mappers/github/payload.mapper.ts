export class GitHubPayloadMapper {
    static import(
        type: 'PullRequestEvent' | 'IssueCommentEvent' | 'CreateEvent' | 'ReleaseEvent' | 'WatchEvent' | 'PushEvent' | 'IssuesEvent',
        input: any
    ) {
        const output: any = {};

        switch(type) {
            case 'PullRequestEvent':
                output.title = input.pull_request.title;
                break;
            case 'IssuesEvent':
                output.title = input.issue.title;
                output.action = input.action;
                break;
            case 'IssueCommentEvent':
                output.title = input.comment.body;
                output.action = input.action;
                break;
            case 'CreateEvent':
                output.title = `${input.ref_type}: ${input.ref}`;
                break;
            case 'ReleaseEvent':
                output.title = `${input.action}: ${input.release.name}`;
                break;
            case 'WatchEvent':
                output.title = `${input.action} watching`;
                break;
            case 'PushEvent':
                output.title = `Push to ${input.ref} branch`;
                break;
        }

        return output;
    }
}