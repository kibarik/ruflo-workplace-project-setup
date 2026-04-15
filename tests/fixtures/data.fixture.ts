import { test as base } from '@playwright/test';

/**
 * Test Data Fixtures
 *
 * Reusable test data and setup for feature tests.
 */

export interface TestData {
  users: {
    valid: { email: string; password: string; name: string };
    admin: { email: string; password: string; name: string };
  };
  agents: {
    coder: { type: string; name: string; model: string };
    tester: { type: string; name: string; model: string };
    reviewer: { type: string; name: string; model: string };
  };
  swarm: {
    hierarchical: { topology: string; maxAgents: number };
    mesh: { topology: string; maxAgents: number };
  };
}

export const testData: TestData = {
  users: {
    valid: {
      email: 'test@example.com',
      password: 'SecurePass123!',
      name: 'Test User'
    },
    admin: {
      email: 'admin@example.com',
      password: 'AdminPass123!',
      name: 'Admin User'
    }
  },
  agents: {
    coder: {
      type: 'coder',
      name: 'test-coder',
      model: 'sonnet'
    },
    tester: {
      type: 'tester',
      name: 'test-tester',
      model: 'haiku'
    },
    reviewer: {
      type: 'reviewer',
      name: 'test-reviewer',
      model: 'sonnet'
    }
  },
  swarm: {
    hierarchical: {
      topology: 'hierarchical',
      maxAgents: 8
    },
    mesh: {
      topology: 'mesh',
      maxAgents: 15
    }
  }
};

type DataFixture = {
  testData: TestData;
};

export const test = base.extend<DataFixture>({
  testData: async ({}, use) => {
    await use(testData);
  }
});
