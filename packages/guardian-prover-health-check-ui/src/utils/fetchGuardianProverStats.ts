import axios from "axios";

const healthCheckRoute = "healthchecks";

const statsRoute = "stats";

export type HealthCheck = {
  id: number;
  guardianProverId: number;
  alive: boolean;
  expectedAddress: string;
  recoveredAddress: string;
  signedResponse: string;
};

export type Stat = {
  guardianProverId: number;
  date: string;
  requests: number;
  successfulRequests: number;
  uptime: number;
  createdAt: number;
};

export type PageResponse<T> = {
  items: T[];
  page: number;
  size: number;
  max_page: number;
  total_pages: number;
  total: number;
  last: boolean;
  first: boolean;
  visible: number;
};

export async function fetchGuardianProverRequests(
  baseURL: string,
  page: number,
  guardianProverId?: string
): Promise<PageResponse<HealthCheck>> {
  let url;
  if (guardianProverId) {
    url = `${baseURL}/${healthCheckRoute}/${guardianProverId}`;
  } else {
    url = `${baseURL}/${healthCheckRoute}`;
  }

  const resp = await axios.get<PageResponse<HealthCheck>>(url, {
    params: {
      page: page,
    },
  });

  return resp.data;
}

export async function fetchAllGuardianProverRequests(
  baseURL: string,
  guardianProverId?: string
): Promise<HealthCheck[]> {
  const page = await fetchGuardianProverRequests(baseURL, 0, guardianProverId);
  const totalPages = page.total_pages;
  if (totalPages === 1) {
    return page.items;
  }

  const healthChecks: HealthCheck[] = [];
  healthChecks.concat(page.items);

  await Promise.all(
    [...Array(totalPages)].map(async (x, i) => {
      const page = await fetchGuardianProverRequests(
        baseURL,
        i,
        guardianProverId
      );

      healthChecks.concat(page.items);
    })
  );

  return healthChecks;
}

export async function fetchStats(
  baseURL: string,
  page: number,
  guardianProverId?: string
): Promise<PageResponse<Stat>> {
  let url;
  if (guardianProverId) {
    url = `${baseURL}/${statsRoute}/${guardianProverId}`;
  } else {
    url = `${baseURL}/${statsRoute}`;
  }

  const resp = await axios.get<PageResponse<Stat>>(url, {
    params: {
      page: page,
    },
  });

  return resp.data;
}

export async function fetchAllStats(
  baseURL: string,
  guardianProverId?: string
): Promise<Stat[]> {
  const page = await fetchStats(baseURL, 0, guardianProverId);
  const totalPages = page.total_pages;
  if (totalPages === 1) {
    return page.items;
  }

  const stats: Stat[] = [];
  stats.concat(page.items);

  await Promise.all(
    [...Array(totalPages)].map(async (x, i) => {
      const page = await fetchStats(baseURL, i, guardianProverId);

      stats.concat(page.items);
    })
  );

  return stats;
}