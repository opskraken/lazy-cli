import { NextResponse } from "next/server";

// Security headers to prevent common vulnerabilities
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

export async function GET() {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'LazyCLI-Website',
      ...(process.env.GITHUB_TOKEN && {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
      })
    };

    // Fetch repository data
    const repoResponse = await fetch(
      'https://api.github.com/repos/iammhador/lazycli',
      {
        headers,
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!repoResponse.ok) {
      throw new Error(`GitHub API error: ${repoResponse.status}`);
    }

    const repoData = await repoResponse.json();

    // Fetch contributors data
    const contributorsResponse = await fetch(
      'https://api.github.com/repos/iammhador/lazycli/contributors',
      {
        headers,
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!contributorsResponse.ok) {
      throw new Error(`GitHub API error: ${contributorsResponse.status}`);
    }

    const contributorsData = await contributorsResponse.json();
    
    return NextResponse.json({
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      openIssues: repoData.open_issues_count,
      contributors: contributorsData.slice(0, 12) // Limit to top 12 contributors
    }, {
      headers: securityHeaders
    });
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch GitHub data',
        message: error instanceof Error ? error.message : 'Unknown error',
        stars: 0,
        forks: 0,
        openIssues: 0,
        contributors: []
      },
      { 
        status: 500,
        headers: securityHeaders
      }
    );
  }
}
