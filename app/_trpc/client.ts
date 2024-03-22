import { AppRouter } from '@/trpc';
import { createTRPCClient, createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>({

})


