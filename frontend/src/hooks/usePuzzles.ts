import { useEffect } from 'react';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import { CrypticDatabaseService } from '../services/cryptics';
import { UserPuzzleDatabaseService } from '../services/userPuzzles';
import type { Cryptogram } from '../types/cryptogram';

const queryKeys = {
  latestOfficial: ['officialPuzzle', 'latest'] as const,
  officialById: (id: number) => ['officialPuzzle', id] as const,
  officialArchive: (limit: number) => ['officialArchive', limit] as const,
  userById: (id: number) => ['userPuzzle', id] as const,
  userArchive: (limit: number) => ['userArchive', limit] as const,
};

export const useLatestOfficialPuzzle = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient();

  const query = useQuery<Cryptogram | null, Error>({
    queryKey: queryKeys.latestOfficial,
    queryFn: () => CrypticDatabaseService.getLatestCryptogram(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: options?.enabled ?? true,
  });

  useEffect(() => {
    if (query.data) {
      queryClient.setQueryData(queryKeys.officialById(query.data.id), query.data);
    }
  }, [query.data, queryClient]);

  return query;
};

export const useOfficialPuzzle = (id: number | undefined, options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient();
  const enabled = options?.enabled ?? (typeof id === 'number' && Number.isFinite(id));

  const query = useQuery<Cryptogram | null, Error>({
    queryKey: typeof id === 'number' ? queryKeys.officialById(id) : queryKeys.latestOfficial,
    queryFn: () =>
      typeof id === 'number'
        ? CrypticDatabaseService.getCryptogramById(id)
        : CrypticDatabaseService.getLatestCryptogram(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled,
  });

  useEffect(() => {
    if (query.data) {
      queryClient.setQueryData(queryKeys.officialById(query.data.id), query.data);
    }
  }, [query.data, queryClient]);

  return query;
};

export const useOfficialArchive = (limit = 20) => {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery<Cryptogram[], Error>({
    queryKey: queryKeys.officialArchive(limit),
    queryFn: ({ pageParam }) =>
      CrypticDatabaseService.getLatestCryptograms(
        typeof pageParam === 'number' ? pageParam : 1,
        limit
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < limit ? undefined : allPages.length + 1,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    const pages = (query.data?.pages ?? []) as Cryptogram[][];
    pages.forEach((page) => {
      page.forEach((puzzle: Cryptogram) => {
        queryClient.setQueryData(queryKeys.officialById(puzzle.id), puzzle);
      });
    });
  }, [query.data, queryClient]);

  return query;
};

export const useUserPuzzle = (id: number | undefined, options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient();
  const enabled = options?.enabled ?? (typeof id === 'number' && Number.isFinite(id));

  const query = useQuery<Cryptogram | null, Error>({
    queryKey: typeof id === 'number' ? queryKeys.userById(id) : ['userPuzzle', 'latest'],
    queryFn: () =>
      typeof id === 'number'
        ? UserPuzzleDatabaseService.getUserPuzzleById(id)
        : Promise.resolve(null),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled,
  });

  useEffect(() => {
    if (query.data && typeof id === 'number') {
      queryClient.setQueryData(queryKeys.userById(id), query.data);
    }
  }, [id, query.data, queryClient]);

  return query;
};

export const useUserArchive = (limit = 20) => {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery<Cryptogram[], Error>({
    queryKey: queryKeys.userArchive(limit),
    queryFn: ({ pageParam }) =>
      UserPuzzleDatabaseService.getLatestUserPuzzles(
        typeof pageParam === 'number' ? pageParam : 1,
        limit
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < limit ? undefined : allPages.length + 1,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    const pages = (query.data?.pages ?? []) as Cryptogram[][];
    pages.forEach((page) => {
      page.forEach((puzzle: Cryptogram) => {
        queryClient.setQueryData(queryKeys.userById(puzzle.id), puzzle);
      });
    });
  }, [query.data, queryClient]);

  return query;
};

export const getCachedOfficialPuzzle = (id: number, queryClient: QueryClient) => {
  return queryClient.getQueryData<Cryptogram | null>(queryKeys.officialById(id)) ?? null;
};

export const getCachedUserPuzzle = (id: number, queryClient: QueryClient) => {
  return queryClient.getQueryData<Cryptogram | null>(queryKeys.userById(id)) ?? null;
};
