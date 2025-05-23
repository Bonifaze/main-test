import axios from 'axios';

const WIKIDATA_API_URL = 'https://www.wikidata.org/w/api.php';

export interface WikidataEdit {
  id: string;
  title: string;
  timestamp: string;
  user: string;
  comment: string;
  size: {
    old: number;
    new: number;
    diff: number;
  };
  tags: string[];
  property?: string;
}

export interface WikidataEntity {
  id: string;
  labels: Record<string, { language: string; value: string }>;
  descriptions: Record<string, { language: string; value: string }>;
  claims: Record<string, any[]>;
}

// Helper function to determine which property was edited based on comment
const determineEditedProperty = (comment: string): string | undefined => {
  const commentLower = comment.toLowerCase();
  
  if (commentLower.includes('label')) return 'labels';
  if (commentLower.includes('description')) return 'descriptions';
  if (commentLower.includes('alias')) return 'aliases';
  if (commentLower.includes('statement') || commentLower.includes('claim')) return 'statements';
  if (commentLower.includes('qualifier')) return 'qualifiers';
  if (commentLower.includes('reference')) return 'references';
  if (commentLower.includes('sitelink')) return 'sitelinks';
  
  return undefined;
};

// Get recent changes by username
export const getUserEdits = async (
  username: string,
  dateRange: { from: string; to: string },
  properties: string[] = [],
  limit: number = 1000
): Promise<WikidataEdit[]> => {
  try {
    const params = new URLSearchParams({
      action: 'query',
      list: 'usercontribs',
      ucuser: username,
      ucstart: dateRange.to + 'T23:59:59Z',
      ucend: dateRange.from + 'T00:00:00Z',
      uclimit: '5000', // Request more to account for filtering
      ucprop: 'ids|title|timestamp|comment|size|tags',
      format: 'json',
      origin: '*',
    });

    const response = await axios.get(`${WIKIDATA_API_URL}?${params.toString()}`);
    
    if (response.data?.query?.usercontribs) {
      const edits = response.data.query.usercontribs.map((edit: any) => ({
        id: edit.revid,
        title: edit.title,
        timestamp: edit.timestamp,
        user: username,
        comment: edit.comment,
        size: {
          old: edit.size - edit.sizediff,
          new: edit.size,
          diff: edit.sizediff
        },
        tags: edit.tags,
        property: determineEditedProperty(edit.comment)
      }));
      
      // Filter by selected properties if any are specified
      if (properties.length > 0) {
        return edits
          .filter((edit: WikidataEdit) => edit.property && properties.includes(edit.property))
          .slice(0, limit);
      }
      
      return edits.slice(0, limit);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching user edits:', error);
    throw error;
  }
};

// Get edits for a specific entity (Q-ID)
export const getEntityEdits = async (
  entityId: string,
  dateRange: { from: string; to: string },
  limit: number = 100
): Promise<WikidataEdit[]> => {
  try {
    const params = new URLSearchParams({
      action: 'query',
      prop: 'revisions',
      titles: entityId,
      rvprop: 'ids|timestamp|user|comment|size|tags',
      rvstart: dateRange.to + 'T23:59:59Z',
      rvend: dateRange.from + 'T00:00:00Z',
      rvlimit: limit.toString(),
      format: 'json',
      origin: '*',
    });

    const response = await axios.get(`${WIKIDATA_API_URL}?${params.toString()}`);
    
    const pages = response.data?.query?.pages;
    if (!pages) return [];
    
    const pageId = Object.keys(pages)[0];
    const revisions = pages[pageId]?.revisions || [];
    
    return revisions.map((rev: any) => ({
      id: rev.revid,
      title: entityId,
      timestamp: rev.timestamp,
      user: rev.user,
      comment: rev.comment,
      size: {
        old: rev.size - (rev.sizediff || 0),
        new: rev.size,
        diff: rev.sizediff || 0
      },
      tags: rev.tags || [],
      property: determineEditedProperty(rev.comment)
    }));
  } catch (error) {
    console.error('Error fetching entity edits:', error);
    throw error;
  }
};

// Get entity details
export const getEntityDetails = async (entityId: string): Promise<WikidataEntity | null> => {
  try {
    const params = new URLSearchParams({
      action: 'wbgetentities',
      ids: entityId,
      props: 'labels|descriptions|claims',
      languages: 'en',
      format: 'json',
      origin: '*',
    });

    const response = await axios.get(`${WIKIDATA_API_URL}?${params.toString()}`);
    
    const entity = response.data?.entities?.[entityId];
    if (!entity) return null;
    
    return {
      id: entityId,
      labels: entity.labels || {},
      descriptions: entity.descriptions || {},
      claims: entity.claims || {}
    };
  } catch (error) {
    console.error('Error fetching entity details:', error);
    throw error;
  }
};

// Get recent changes across Wikidata
export const getRecentChanges = async (
  dateRange: { from: string; to: string },
  limit: number = 100
): Promise<WikidataEdit[]> => {
  try {
    const params = new URLSearchParams({
      action: 'query',
      list: 'recentchanges',
      rcstart: dateRange.to + 'T23:59:59Z',
      rcend: dateRange.from + 'T00:00:00Z',
      rclimit: limit.toString(),
      rcprop: 'title|ids|sizes|flags|user|timestamp|comment|tags',
      rcnamespace: '0',
      format: 'json',
      origin: '*',
    });

    const response = await axios.get(`${WIKIDATA_API_URL}?${params.toString()}`);
    
    if (response.data?.query?.recentchanges) {
      return response.data.query.recentchanges.map((change: any) => ({
        id: change.revid,
        title: change.title,
        timestamp: change.timestamp,
        user: change.user,
        comment: change.comment,
        size: {
          old: change.oldlen,
          new: change.newlen,
          diff: change.newlen - change.oldlen
        },
        tags: change.tags,
        property: determineEditedProperty(change.comment)
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching recent changes:', error);
    throw error;
  }
};

// Export data in various formats
export const exportData = async (data: any, format: 'csv' | 'json' | 'pdf'): Promise<string> => {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }
  
  if (format === 'csv') {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((item: any) => 
      Object.values(item).map(value => 
        typeof value === 'object' ? JSON.stringify(value) : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  }
  
  if (format === 'pdf') {
    return 'PDF generation would happen here';
  }
  
  return '';
};

// Get edits for multiple users and analyze their activity
export const getBulkUserEdits = async (
  usernames: string[],
  dateRange: { from: string; to: string },
  properties: string[] = [],
  limit: number = 100
): Promise<{
  userStats: Record<string, {
    totalEdits: number;
    propertyStats: Record<string, number>;
    totalBytesAdded: number;
    totalBytesRemoved: number;
  }>;
  topUsers: {
    byEdits: Array<{ username: string; count: number }>;
    byProperty: Record<string, Array<{ username: string; count: number }>>;
    byBytesAdded: Array<{ username: string; bytes: number }>;
  };
}> => {
  try {
    // Fetch edits for all users
    const allEdits = await Promise.all(
      usernames.map(username => getUserEdits(username, dateRange, properties, limit))
    );

    // Initialize stats
    const userStats: Record<string, {
      totalEdits: number;
      propertyStats: Record<string, number>;
      totalBytesAdded: number;
      totalBytesRemoved: number;
    }> = {};

    // Process edits for each user
    allEdits.forEach((edits, index) => {
      const username = usernames[index];
      const stats = {
        totalEdits: edits.length,
        propertyStats: {} as Record<string, number>,
        totalBytesAdded: 0,
        totalBytesRemoved: 0
      };

      edits.forEach(edit => {
        // Count property edits
        if (edit.property) {
          stats.propertyStats[edit.property] = (stats.propertyStats[edit.property] || 0) + 1;
        }

        // Count bytes
        if (edit.size.diff > 0) {
          stats.totalBytesAdded += edit.size.diff;
        } else {
          stats.totalBytesRemoved += Math.abs(edit.size.diff);
        }
      });

      userStats[username] = stats;
    });

    // Calculate top users
    const topUsers = {
      byEdits: Object.entries(userStats)
        .map(([username, stats]) => ({ username, count: stats.totalEdits }))
        .sort((a, b) => b.count - a.count),
      byProperty: {} as Record<string, Array<{ username: string; count: number }>>,
      byBytesAdded: Object.entries(userStats)
        .map(([username, stats]) => ({ username, bytes: stats.totalBytesAdded }))
        .sort((a, b) => b.bytes - a.bytes)
    };

    // Calculate top users by property
    properties.forEach(property => {
      topUsers.byProperty[property] = Object.entries(userStats)
        .map(([username, stats]) => ({
          username,
          count: stats.propertyStats[property] || 0
        }))
        .sort((a, b) => b.count - a.count);
    });

    return { userStats, topUsers };
  } catch (error) {
    console.error('Error fetching bulk user edits:', error);
    throw error;
  }
};