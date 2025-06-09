import axios from 'axios';

interface Contributor {
  login: string;
  name: string;
  avatar_url: string;
  profile: string;
  contributions: string[];
}

interface AllContributorsData {
  projectName: string;
  projectOwner: string;
  repoType: string;
  repoHost: string;
  files: string[];
  imageSize: number;
  commit: boolean;
  contributors: Contributor[];
  contributorsPerLine: number;
}

export const fetchMembers = async (): Promise<Contributor[]> => {
  try {
    const response = await axios.get<AllContributorsData>(
      'https://raw.githubusercontent.com/ComBuildersES/.github/main/.all-contributorsrc'
    );
    return response.data.contributors;
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
};

export const processMemberData = (contributor: Contributor) => {
  return {
    id: contributor.login,
    name: contributor.name || contributor.login,
    role: contributor.contributions.join(', '),
    avatar: contributor.avatar_url,
    social: {
      github: contributor.profile,
      linkedin: `https://linkedin.com/in/${contributor.login}`
    }
  };
}; 