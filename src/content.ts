import githubActivity from './data/github-activity.json';

// Edit personal content here. Empty contact URLs are never rendered.
export const profile: {
  name: string;
  tagline?: string;
  headline: string[];
  about: string[];
  github: string;
} = {
  name: 'Aotumuri',
  // tagline: '',
  headline: ['プログラミング初心者です。', 'AIと英語を勉強中。'],
  about: [
    'こんにちは、Aotumuriです！',
    'プログラミング初心者です。',
    'AIやマルチエージェントに興味があります。OpenFrontでは翻訳の取りまとめ役（Translation Lead）を担当しています（2026年10月現在）。調べたことは、備忘録も兼ねてQiitaに投稿しています。',
  ],
  github: 'https://github.com/Aotumuri',
};

// Verified public repositories. Add a matching entry to github-activity.json when extending this list.
export const openfront = githubActivity.openfront;
export const projectGroups = [
  { id: 'simulation', name: 'シミュレーター' },
  { id: 'openfront', name: 'Webのツール' },
] as const;

export const projects = [
  {
    name: 'TerritoryConquestSimulator',
    group: 'simulation',
    description: '自動で動くものが見たい人へ。',
  },
  { name: 'isekai-sim', group: 'simulation', description: '自動で動くものが見たい人へ、その2。' },
  {
    name: 'openfront-utility',
    group: 'openfront',
    description: '領土のパターンを作って、プレビューするツールです。',
  },
  {
    name: 'custom-flag-creator',
    group: 'openfront',
    description: 'SVGのパーツを重ねて旗を作れます。',
  },
].map((project) => {
  const repository = githubActivity.repositories.find(
    (repository) => repository.name === project.name,
  );
  if (!repository) throw new Error(`Missing verified repository: ${project.name}`);
  return { ...repository, ...project };
});

export const skills = [
  { symbol: 'TS', name: 'TypeScript / JavaScript', field: 'Web development' },
  { symbol: 'Py', name: 'Python', field: 'Programming' },
  { symbol: 'Rs', name: 'Rust', field: 'Programming' },
  { symbol: '✳', name: 'React', field: 'User interfaces' },
  { symbol: '⌘', name: 'Git / GitHub', field: 'Open source' },
  { symbol: '↗', name: 'AI / Machine Learning', field: 'Research & interests' },
  { symbol: '◇', name: 'Game Development', field: 'Exploration & interests' },
];

export const contacts = [
  { name: 'GitHub', handle: '@Aotumuri', url: profile.github },
  { name: 'Qiita', handle: '@Aotumuri', url: 'https://qiita.com/Aotumuri' },
  { name: 'Discord', handle: '', url: '' },
  { name: 'Email', handle: '', url: '' },
];

export const sections = [
  { id: 'home', name: 'Surface', depth: '000' },
  { id: 'about', name: 'About', depth: '100' },
  { id: 'works', name: 'Works', depth: '500' },
  { id: 'skills', name: 'Skills', depth: '1,000' },
  { id: 'contact', name: 'Contact', depth: '3,000' },
] as const;
