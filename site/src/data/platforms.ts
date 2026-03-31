export interface Platform {
  name: string;
  icon: string;
  stack: string[];
  color: string;
  borderColor: string;
}

export const platforms: Platform[] = [
  {
    name: 'Web',
    icon: '◈',
    stack: ['Next.js 14 App Router', 'React 18', 'TypeScript 5+', 'Tailwind CSS', 'shadcn/ui + klara-theme', 'Jest + Playwright'],
    color: '#3b82f6',
    borderColor: 'border-blue-500/30',
  },
  {
    name: 'iOS',
    icon: '◉',
    stack: ['Swift 6', 'SwiftUI + UIKit', 'iOS 18+', 'XCTest + XCUITest', 'XcodeBuildMCP'],
    color: '#f97316',
    borderColor: 'border-orange-500/30',
  },
  {
    name: 'Android',
    icon: '◎',
    stack: ['Kotlin', 'Jetpack Compose', 'MVVM + Hilt DI', 'Room + Retrofit', 'JUnit + Espresso'],
    color: '#22c55e',
    borderColor: 'border-green-500/30',
  },
  {
    name: 'Backend',
    icon: '◇',
    stack: ['Java 8', 'Jakarta EE 8', 'WildFly 26.1', 'Hibernate + PostgreSQL', 'Maven + SonarQube'],
    color: '#8b5cf6',
    borderColor: 'border-purple-500/30',
  },
];
