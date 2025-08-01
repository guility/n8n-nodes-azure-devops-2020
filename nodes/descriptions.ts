import {
    INodeProperties,
} from 'n8n-workflow';

// Board Operations
export const boardOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: { show: { resource: ['board'] } },
        options: [
            { name: 'Get', value: 'get', description: 'Get a specific board' },
            { name: 'Get All', value: 'getAll', description: 'Get all boards' },
            { name: 'Get Columns', value: 'getColumns', description: 'Get columns of a board' },
        ],
        default: 'get',
    },
];

export const boardFields: INodeProperties[] = [
    {
        displayName: 'Project',
        name: 'project',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['board'] } },
        description: 'The name of the Azure DevOps project',
    },
    {
        displayName: 'Board ID',
        name: 'boardId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['board'], operation: ['get', 'getColumns'] } },
        description: 'ID of the board to retrieve',
    },
];

// Git Operations
export const gitOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: { show: { resource: ['git'] } },
        options: [
            { name: 'Get Repository', value: 'getRepository', description: 'Get a git repository' },
            { name: 'Create Repository', value: 'createRepository', description: 'Create a new git repository' },
            { name: 'Get All Repositories', value: 'getAllRepositories', description: 'Get all git repositories' },
            { name: 'Get Pull Request', value: 'getPullRequest', description: 'Get a pull request' },
            { name: 'Create Pull Request', value: 'createPullRequest', description: 'Create a new pull request' },
            { name: 'Get Branches', value: 'getBranches', description: 'Get branches in a repository' },
            { name: 'Get Commits', value: 'getCommits', description: 'Get commits in a repository' },
            { name: 'Create Branch', value: 'createBranch', description: 'Create a new branch' },
            { name: 'Get Commit', value: 'getCommit', description: 'Get a specific commit' },
        ],
        default: 'getRepository',
    },
];

export const gitFields: INodeProperties[] = [
    {
        displayName: 'Project',
        name: 'project',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['git'] } },
        description: 'The name of the Azure DevOps project',
    },
    {
        displayName: 'Repository',
        name: 'repository',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['git'],
                operation: [
                    'getRepository',
                    'getPullRequest',
                    'createPullRequest',
                    'getBranches',
                    'getCommits',
                    'createBranch',
                    'getCommit'
                ]
            }
        },
        description: 'The name of the git repository',
    },
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['git'], operation: ['createRepository'] } },
        description: 'Name of the new repository',
    },
    {
        displayName: 'Pull Request ID',
        name: 'pullRequestId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['git'], operation: ['getPullRequest'] } },
        description: 'ID of the pull request',
    },
    {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['git'], operation: ['createPullRequest'] } },
        description: 'Title of the pull request',
    },
    {
        displayName: 'Source Branch',
        name: 'sourceBranch',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['git'], operation: ['createPullRequest', 'createBranch'] } },
        description: 'Source branch name',
    },
    {
        displayName: 'Target Branch',
        name: 'targetBranch',
        type: 'string',
        required: true,
        default: 'main',
        displayOptions: { show: { resource: ['git'], operation: ['createPullRequest'] } },
        description: 'Target branch name',
    },
    {
        displayName: 'Commit ID',
        name: 'commitId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['git'], operation: ['getCommit'] } },
        description: 'ID of the commit to retrieve',
    },
    {
        displayName: 'Branch Name',
        name: 'branchName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['git'], operation: ['createBranch'] } },
        description: 'Name of the new branch',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['git'], operation: ['createPullRequest'] } },
        options: [
            {
                displayName: 'Description',
                name: 'description',
                type: 'string',
                default: '',
                description: 'Pull request description',
            },
            {
                displayName: 'Reviewers',
                name: 'reviewers',
                type: 'string',
                default: '',
                description: 'Comma-separated list of reviewer IDs',
            },
            {
                displayName: 'Auto Complete',
                name: 'autoComplete',
                type: 'boolean',
                default: false,
                description: 'Whether to auto-complete the PR after creation',
            },
        ],
    },
    {
        displayName: 'Branch',
        name: 'branch',
        type: 'string',
        default: 'main',
        displayOptions: { show: { resource: ['git'], operation: ['getCommits'] } },
        description: 'Branch to get commits from',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: { minValue: 1 },
        default: 25,
        displayOptions: { show: { resource: ['git'], operation: ['getCommits', 'getAllRepositories'] } },
        description: 'Max number of results to return',
    },
];

// Pipeline Operations
export const pipelineOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: { show: { resource: ['pipeline'] } },
        options: [
            { name: 'Run', value: 'run', description: 'Run a pipeline' },
            { name: 'Get Run', value: 'getRun', description: 'Get a pipeline run' },
            { name: 'Get All Pipelines', value: 'getAllPipelines', description: 'Get all pipelines' },
            { name: 'Get All Runs', value: 'getAllRuns', description: 'Get all runs for a pipeline' },
            { name: 'Get Artifacts', value: 'getArtifacts', description: 'Get artifacts from a pipeline run' },
            { name: 'Cancel Run', value: 'cancelRun', description: 'Cancel a pipeline run' },
            { name: 'Get Logs', value: 'getLogs', description: 'Get logs for a pipeline run' },
        ],
        default: 'run',
    },
];

export const pipelineFields: INodeProperties[] = [
    {
        displayName: 'Project',
        name: 'project',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['pipeline'] } },
        description: 'The name of the Azure DevOps project',
    },
    {
        displayName: 'Pipeline',
        name: 'pipeline',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['pipeline'],
                operation: ['run', 'getAllRuns']
            }
        },
        description: 'Name of the pipeline',
    },
    {
        displayName: 'Run ID',
        name: 'runId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['pipeline'],
                operation: ['getRun', 'getArtifacts', 'cancelRun', 'getLogs']
            }
        },
        description: 'ID of the pipeline run',
    },
    {
        displayName: 'Parameters',
        name: 'parameters',
        type: 'json',
        default: '{}',
        displayOptions: {
            show: {
                resource: ['pipeline'],
                operation: ['run']
            }
        },
        description: 'JSON object of parameters to pass to the pipeline',
    },
    {
        displayName: 'Stage to Skip',
        name: 'skipStage',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['pipeline'],
                operation: ['run']
            }
        },
        description: 'Name of the stage to skip',
    },
];

// Wiki Operations
export const wikiOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: { show: { resource: ['wiki'] } },
        options: [
            { name: 'Get Page', value: 'getPage', description: 'Get a wiki page' },
            { name: 'Create Page', value: 'createPage', description: 'Create a wiki page' },
            { name: 'Update Page', value: 'updatePage', description: 'Update a wiki page' },
            { name: 'Delete Page', value: 'deletePage', description: 'Delete a wiki page' },
            { name: 'Get All Pages', value: 'getAllPages', description: 'Get all wiki pages' },
            { name: 'Get Page Content', value: 'getPageContent', description: 'Get raw content of a wiki page' },
            { name: 'Get Page Metadata', value: 'getPageMetadata', description: 'Get metadata of a wiki page' },
        ],
        default: 'getPage',
    },
];

export const wikiFields: INodeProperties[] = [
    {
        displayName: 'Project',
        name: 'project',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['wiki'] } },
        description: 'The name of the Azure DevOps project',
    },
    {
        displayName: 'Wiki',
        name: 'wiki',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['wiki'] } },
        description: 'Name of the wiki',
    },
    {
        displayName: 'Page Path',
        name: 'pagePath',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['wiki'],
                operation: [
                    'getPage',
                    'createPage',
                    'updatePage',
                    'deletePage',
                    'getPageContent',
                    'getPageMetadata'
                ]
            }
        },
        description: 'Path of the wiki page (e.g., /Home)',
    },
    {
        displayName: 'Content',
        name: 'content',
        type: 'string',
        typeOptions: { rows: 5 },
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['wiki'],
                operation: ['createPage', 'updatePage']
            }
        },
        description: 'Content of the wiki page in Markdown format',
    },
    {
        displayName: 'ETag',
        name: 'etag',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['wiki'],
                operation: ['updatePage']
            }
        },
        description: 'ETag for concurrency control',
    },
    {
        displayName: 'Recursion Level',
        name: 'recursionLevel',
        type: 'options',
        options: [
            { name: 'None', value: 'None' },
            { name: 'One Level', value: 'OneLevel' },
            { name: 'Full', value: 'Full' },
        ],
        default: 'OneLevel',
        displayOptions: {
            show: {
                resource: ['wiki'],
                operation: ['getAllPages']
            }
        },
        description: 'Level of recursion for pages',
    },
    {
        displayName: 'Include Content',
        name: 'includeContent',
        type: 'boolean',
        default: true,
        displayOptions: {
            show: {
                resource: ['wiki'],
                operation: ['getPage']
            }
        },
        description: 'Whether to include page content in the response',
    },
];

// Work Item Operations
export const workItemOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: { show: { resource: ['workItem'] } },
        options: [
            { name: 'Get', value: 'get', description: 'Get a work item' },
            { name: 'Create', value: 'create', description: 'Create a work item' },
            { name: 'Update', value: 'update', description: 'Update a work item' },
            { name: 'Delete', value: 'delete', description: 'Delete a work item' },
            { name: 'Query (WIQL)', value: 'query', description: 'Query work items using WIQL' },
            { name: 'Get All', value: 'getAll', description: 'Get all work items' },
            { name: 'Add Comment', value: 'addComment', description: 'Add comment to a work item' },
            { name: 'Get Comments', value: 'getComments', description: 'Get comments for a work item' },
            { name: 'Add Attachment', value: 'addAttachment', description: 'Add attachment to a work item' },
        ],
        default: 'get',
    },
];

export const workItemFields: INodeProperties[] = [
    {
        displayName: 'Project',
        name: 'project',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['workItem'] } },
        description: 'The name of the Azure DevOps project',
    },
    {
        displayName: 'Work Item ID',
        name: 'workItemId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['workItem'],
                operation: [
                    'get',
                    'update',
                    'delete',
                    'addComment',
                    'getComments',
                    'addAttachment'
                ]
            }
        },
        description: 'ID of the work item',
    },
    {
        displayName: 'Work Item Type',
        name: 'workItemType',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['workItem'],
                operation: ['create']
            }
        },
        description: 'Type of work item (e.g., Bug, Task, User Story)',
    },
    {
        displayName: 'Fields',
        name: 'fields',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['workItem'],
                operation: ['create', 'update']
            }
        },
        options: [
            {
                name: 'field',
                displayName: 'Field',
                values: [
                    {
                        displayName: 'Name',
                        name: 'name',
                        type: 'string',
                        default: '',
                        description: 'Field name (e.g., System.Title)',
                    },
                    {
                        displayName: 'Value',
                        name: 'value',
                        type: 'string',
                        default: '',
                        description: 'Field value',
                    },
                ],
            },
        ],
    },
    {
        displayName: 'WIQL Query',
        name: 'query',
        type: 'string',
        typeOptions: { rows: 5 },
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['workItem'],
                operation: ['query']
            }
        },
        description: 'Work Item Query Language (WIQL) query',
    },
    {
        displayName: 'Work Item Type',
        name: 'workItemType',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['workItem'],
                operation: ['getAll']
            }
        },
        description: 'Filter by work item type (e.g., Bug, Task)',
    },
    {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        typeOptions: { rows: 3 },
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['workItem'],
                operation: ['addComment']
            }
        },
        description: 'Comment text to add',
    },
    {
        displayName: 'Attachment URL',
        name: 'attachmentUrl',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['workItem'],
                operation: ['addAttachment']
            }
        },
        description: 'URL of the attachment to add',
    },
    {
        displayName: 'Attachment Name',
        name: 'attachmentName',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['workItem'],
                operation: ['addAttachment']
            }
        },
        description: 'Name for the attachment (optional)',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: { minValue: 1 },
        default: 25,
        displayOptions: {
            show: {
                resource: ['workItem'],
                operation: ['getAll', 'getComments']
            }
        },
        description: 'Max number of results to return',
    },
];

// Identity Operations
export const identityOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: { show: { resource: ['identity'] } },
        options: [
            { name: 'Get', value: 'get', description: 'Get an identity by ID' },
            { name: 'Get By Descriptor', value: 'getByDescriptor', description: 'Get an identity by descriptor' },
            { name: 'Search', value: 'search', description: 'Search identities' },
        ],
        default: 'get',
    },
];

export const identityFields: INodeProperties[] = [
    {
        displayName: 'Identity',
        name: 'identity',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['identity'],
                operation: ['get']
            }
        },
        description: 'Identity name or ID',
    },
    {
        displayName: 'Descriptor',
        name: 'descriptor',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['identity'],
                operation: ['getByDescriptor']
            }
        },
        description: 'Identity descriptor',
    },
    {
        displayName: 'Search Query',
        name: 'query',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['identity'],
                operation: ['search']
            }
        },
        description: 'Search query for identities',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: { minValue: 1 },
        default: 25,
        displayOptions: {
            show: {
                resource: ['identity'],
                operation: ['search']
            }
        },
        description: 'Max number of results to return',
    },
];