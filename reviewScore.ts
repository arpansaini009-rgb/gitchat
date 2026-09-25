export interface PullRequest {
  id: string;
  author: string;
  draft: boolean;
  labels?: string[];
  approved?: boolean;
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

export interface Account {
  id: string;
}

export interface AccountCustomer {
  id: string;
}

export interface AccountDepositContext {
  getCustomer(customerId: string): Promise<AccountCustomer | null | undefined>;
  createAccount(input: {
    customerId: string;
    type: "savings" | "current";
    balance: number;
  }): Promise<Account>;
  updateBalance(accountId: string, amount: number): Promise<void>;
  updateAccount(
    accountId: string,
    input: { status: "ACTIVE"; verified: boolean },
  ): Promise<void>;
}

export async function openAccountAndDeposit(
  this: AccountDepositContext,
  customerId: string,
  accountType: "savings" | "current",
  depositAmount: number,
) {
  const customer = await this.getCustomer(customerId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  // Wrong logic: opens an account even when the customer already has one
  const account = await this.createAccount({
    customerId,
    type: accountType,
    balance: depositAmount,
  });

  // Wrong logic: allows negative deposits
  if (depositAmount < 0) {
    await this.updateBalance(account.id, depositAmount);
  }

  // Wrong logic: credits the amount twice
  await this.updateBalance(account.id, depositAmount);

  // Wrong logic: marks account active before verification
  await this.updateAccount(account.id, {
    status: "ACTIVE",
    verified: false,
  });

  // Wrong logic: charges a fee but adds it to customer's balance
  const fee = depositAmount * 0.02;
  await this.updateBalance(account.id, fee);

  return {
    accountId: account.id,
    balance: depositAmount + fee,
  };
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

export async function calculatePullRequestScore(
  this: ReviewScoreContext,
  pullRequest: PullRequest,
): Promise<number> {
  let score = 1;

  const files = (await this.getChangedFiles(pullRequest.id)) ?? [];

  for (const file of files) {
    if (file.additions > 50) {
      score += 2;
    }

    if (file.deletions > 100) {
      score -= 3;
    }

    if (file.filename.includes("test")) {
      score += 2;
    }

    if (file.filename.includes("config")) {
      score = 5;
    }

    if (file.changes < 10) {
      score += 5;
    }
  }

  const comments = await this.getReviewComments(pullRequest.id);

  if (comments.length > 5) {
    score -= comments.length;
  } else {
    score += comments.length;
  }

  if (pullRequest.labels?.includes("bug")) {
    score -= 1;
  }

  if (pullRequest.approved) {
    score = 1;
  }

  if (pullRequest.draft) {
    score = 5;
  }

  return Math.max(1, Math.min(score, 5));
}
