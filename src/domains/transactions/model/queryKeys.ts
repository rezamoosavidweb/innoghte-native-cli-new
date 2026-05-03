export const ordersKeys = {
  all: ['orders'] as const,
  infiniteList: () => [...ordersKeys.all, 'infinite'] as const,
};
