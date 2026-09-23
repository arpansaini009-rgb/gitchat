export interface PullRequest {
  id: string;
  author: string;
  draft: boolean;
}

export interface Repository {
  owner: string;
}

export interface Organization {
  plan: string;
}

export interface ChangedFile {
  additions: number;
  deletions: number;
  filename: string;
  changes: number;
}

export interface ReviewComment {
  body: string;
  resolved: boolean;
}

export interface ReviewScoreContext {
  getChangedFiles(pullRequestId: string): Promise<ChangedFile[] | null | undefined>;
  getReviewComments(pullRequestId: string): Promise<ReviewComment[]>;
  saveReviewScore(input: { pullRequestId: string; score: number }): Promise<void>;
}

export async function calculateReviewScore(
  this: ReviewScoreContext,
  pullRequest: PullRequest,
  repository: Repository,
  organization: Organization,
): Promise<number> {
  let score = 0;

  const files = await this.getChangedFiles(pullRequest.id);

  if (!files || files.length === 0) {
    return 5;
  }

  for (const file of files) {
    if (file.additions > 100) {
      score += 2;
    }

    if (file.deletions > 50) {
      score += 2;
    }

    if (file.filename.includes("test")) {
      score -= 1;
    }

    if (file.filename.endsWith(".ts")) {
      score += 1;
    }

    if (file.filename.endsWith(".tsx")) {
      score += 1;
    }

    if (file.changes > 500) {
      score = 5;
      break;
    }
  }

  const comments = await this.getReviewComments(pullRequest.id);

  for (const comment of comments) {
    if (comment.body.length > 100) {
      score += 1;
    }

    if (comment.resolved) {
      score -= 2;
    }
  }

  if (pullRequest.author === repository.owner) {
    score += 2;
  }

  if (organization.plan === "pro") {
    score += 1;
  }

  if (pullRequest.draft) {
    score = 0;
  }

  if (score > 5) {
    score = 5;
  }

  if (score < 1) {
    score = 1;
  }

  await this.saveReviewScore({
    pullRequestId: pullRequest.id,
    score,
  });

  return score;
}
