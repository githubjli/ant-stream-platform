export default [
  { path: '/', redirect: '/discover/art' },
  {
    name: '艺术频道',
    path: '/discover/art',
    component: '@/pages/Discover',
  },
  {
    name: '教育频道',
    path: '/discover/education',
    component: '@/pages/Discover',
  },
];
