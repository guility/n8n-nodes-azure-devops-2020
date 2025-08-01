import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
} from 'n8n-workflow';

import {
    boardFields,
    boardOperations,
    gitFields,
    gitOperations,
    pipelineFields,
    pipelineOperations,
    wikiFields,
    wikiOperations,
    workItemFields,
    workItemOperations,
    identityFields,
    identityOperations,
} from './descriptions';

import {
    azureDevOpsApiRequest,
    getProject,
    getRepositoryId,
    getPipelineId,
    getWikiId,
    getTeamId,
    getIdentityId,
    handleWikiPagination,
    handleWorkItemPagination,
    handlePipelinePagination,
    handleGitPagination,
} from './GenericFunctions';

export class AzureDevOpsServer implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Azure DevOps Server',
        name: 'azureDevOpsServer',
        icon: 'file:azuredevops.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Interact with Azure DevOps Server 2020 REST API',
        defaults: {
            name: 'Azure DevOps Server',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'azureDevOpsServerApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    { name: 'Board', value: 'board' },
                    { name: 'Git', value: 'git' },
                    { name: 'Pipeline', value: 'pipeline' },
                    { name: 'Wiki', value: 'wiki' },
                    { name: 'Work Item', value: 'workItem' },
                    { name: 'Identity', value: 'identity' },
                ],
                default: 'board',
            },
            ...boardOperations,
            ...boardFields,
            ...gitOperations,
            ...gitFields,
            ...pipelineOperations,
            ...pipelineFields,
            ...wikiOperations,
            ...wikiFields,
            ...workItemOperations,
            ...workItemFields,
            ...identityOperations,
            ...identityFields,
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        let responseData;
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'board') {
                    // Board operations
                    if (operation === 'get') {
                        const project = await getProject.call(this, i);
                        const boardId = this.getNodeParameter('boardId', i) as string;
                        const endpoint = `/${project}/_apis/work/boards/${boardId}`;
                        responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                    } else if (operation === 'getAll') {
                        const project = await getProject.call(this, i);
                        const endpoint = `/${project}/_apis/work/boards`;
                        responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                        responseData = responseData.value;
                    } else if (operation === 'getColumns') {
                        const project = await getProject.call(this, i);
                        const boardId = this.getNodeParameter('boardId', i) as string;
                        const endpoint = `/${project}/_apis/work/boards/${boardId}/columns`;
                        responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                        responseData = responseData.value;
                    }
                } else if (resource === 'git') {
                    // Git operations
                    const project = await getProject.call(this, i);

                    if (operation === 'getRepository') {
                        const repositoryId = await getRepositoryId.call(this, i, project);
                        const endpoint = `/${project}/_apis/git/repositories/${repositoryId}`;
                        responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                    } else if (operation === 'createRepository') {
                        const name = this.getNodeParameter('name', i) as string;
                        const endpoint = `/${project}/_apis/git/repositories`;
                        const body = { name };
                        responseData = await azureDevOpsApiRequest.call(this, 'POST', endpoint, body);
                    } else if (operation === 'getAllRepositories') {
                        const endpoint = `/${project}/_apis/git/repositories`;
                        responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                        responseData = handleGitPagination(responseData);
                    } else if (operation === 'getPullRequest') {
                        const repositoryId = await getRepositoryId.call(this, i, project);
                        const prId = this.getNodeParameter('pullRequestId', i) as string;
                        const endpoint = `/${project}/_apis/git/repositories/${repositoryId}/pullrequests/${prId}`;
                        responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                    } else if (operation === 'createPullRequest') {
                        const repositoryId = await getRepositoryId.call(this, i, project);
                        const title = this.getNodeParameter('title', i) as string;
                        const sourceBranch = this.getNodeParameter('sourceBranch', i) as string;
                        const targetBranch = this.getNodeParameter('targetBranch', i) as string;
                        const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;

                        const body = {
                            title,
                            sourceRefName: `refs/heads/${sourceBranch}`,
                            targetRefName: `refs/heads/${targetBranch}`,
                            ...additionalFields,
                        };

                        const endpoint = `/${project}/_apis/git/repositories/${repositoryId}/pullrequests`;
                        responseData = await azureDevOpsApiRequest.call(this, 'POST', endpoint, body);
                    } else if (operation === 'getBranches') {
                        const repositoryId = await getRepositoryId.call(this, i, project);
                        const endpoint = `/${project}/_apis/git/repositories/${repositoryId}/refs?filter=heads/`;
                        responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                        responseData = responseData.value.map((branch: any) => ({
                            name: branch.name.replace('refs/heads/', ''),
                            objectId: branch.objectId
                        }));
                    } else if (operation === 'getCommits') {
                        const repositoryId = await getRepositoryId.call(this, i, project);
                        const branch = this.getNodeParameter('branch', i, '') as string;
                        const limit = this.getNodeParameter('limit', i, 25) as number;

                        let endpoint = `/${project}/_apis/git/repositories/${repositoryId}/commits`;
                        if (branch) endpoint += `?searchCriteria.itemVersion.version=${branch}`;

                        responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                        responseData = responseData.value.slice(0, limit);
                    }
                } else if (resource === 'pipeline') {
                    // Pipeline operations
                    const project = await getProject.call(this, i);

                    if (operation === 'run') {
                        const pipelineId = await getPipelineId.call(this, i, project);
                        const endpoint = `/${project}/_apis/pipelines/${pipelineId}/runs?api-version=6.0-preview.1`;
                        const body = { resources: {} };
                        responseData = await azureDevOpsApiRequest.call(this, 'POST', endpoint, body);
                    } else if (operation === 'getRun') {
                        const runId = this.getNodeParameter('runId', i) as string;
                        const endpoint = `/${project}/_apis/pipelines/runs/${runId}?api-version=6.0-preview.1`;
                        responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                    } else if (operation === 'getAllPipelines') {
                        const endpoint = `/${project}/_apis/pipelines?api-version=6.0-preview.1`;
                        responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                        responseData = handlePipelinePagination(responseData);
                    } else if (operation === 'getAllRuns') {
                        const pipelineId = await getPipelineId.call(this, i, project);
                        const endpoint = `/${project}/_apis/pipelines/${pipelineId}/runs?api-version=6.0-preview.1`;
                        responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                        responseData = handlePipelinePagination(responseData);
                    } else if (operation === 'getArtifacts') {
                        const runId = this.getNodeParameter('runId', i) as string;
                        const endpoint = `/${project}/_apis/pipelines/runs/${runId}/artifacts?api-version=6.0-preview.1`;
                        responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                        responseData = responseData.value;
                    }
                } else if (resource === 'wiki') {
                    // Wiki operations
                    const project = await getProject.call(this, i);
                    const wikiId = await getWikiId.call(this, i, project);

                    if (operation === 'getPage') {
                        const pagePath = this.getNodeParameter('pagePath', i) as string;
                        const endpoint = `/${project}/_apis/wiki/wikis/${wikiId}/pages?path=${encodeURIComponent(pagePath)}&includeContent=true`;
                        responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                    } else if (operation === 'createPage') {
                        const pagePath = this.getNodeParameter('pagePath', i) as string;
                        const content = this.getNodeParameter('content', i) as string;
                        const endpoint = `/${project}/_apis/wiki/wikis/${wikiId}/pages?path=${encodeURIComponent(pagePath)}`;
                        const body = { content };
                        responseData = await azureDevOpsApiRequest.call(this, 'PUT', endpoint, body);
                    } else if (operation === 'updatePage') {
                        const pagePath = this.getNodeParameter('pagePath', i) as string;
                        const content = this.getNodeParameter('content', i) as string;
                        const etag = this.getNodeParameter('etag', i) as string;
                        const endpoint = `/${project}/_apis/wiki/wikis/${wikiId}/pages?path=${encodeURIComponent(pagePath)}`;
                        const body = { content };
                        responseData = await azureDevOpsApiRequest.call(this, 'PUT', endpoint, body, {'If-Match': etag});
                    } else if (operation === 'deletePage') {
                        const pagePath = this.getNodeParameter('pagePath', i) as string;
                        const endpoint = `/${project}/_apis/wiki/wikis/${wikiId}/pages?path=${encodeURIComponent(pagePath)}`;
                        await azureDevOpsApiRequest.call(this, 'DELETE', endpoint);
                        responseData = { success: true };
                    } else if (operation === 'getAllPages') {
                        const recursionLevel = this.getNodeParameter('recursionLevel', i, 'OneLevel') as string;
                        const endpoint = `/${project}/_apis/wiki/wikis/${wikiId}/pages?recursionLevel=${recursionLevel}`;
                        responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                        responseData = handleWikiPagination(responseData);
                    }
                } else if (resource === 'workItem') {
                    // Work Item operations
                    const project = await getProject.call(this, i);

                    if (operation === 'get') {
                        const workItemId = this.getNodeParameter('workItemId', i) as string;
                        const endpoint = `/${project}/_apis/wit/workitems/${workItemId}`;
                        responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                    } else if (operation === 'create') {
                        const workItemType = this.getNodeParameter('workItemType', i) as string;
                        const fields = this.getNodeParameter('fields', i) as any;

                        const body = Object.keys(fields).map(field => ({
                            op: 'add',
                            path: `/fields/${field}`,
                            value: fields[field],
                        }));

                        const endpoint = `/${project}/_apis/wit/workitems/$${workItemType}`;
                        responseData = await azureDevOpsApiRequest.call(this, 'PATCH', endpoint, body);
                    } else if (operation === 'update') {
                        const workItemId = this.getNodeParameter('workItemId', i) as string;
                        const fields = this.getNodeParameter('fields', i) as any;

                        const body = Object.keys(fields).map(field => ({
                            op: 'replace',
                            path: `/fields/${field}`,
                            value: fields[field],
                        }));

                        const endpoint = `/${project}/_apis/wit/workitems/${workItemId}`;
                        responseData = await azureDevOpsApiRequest.call(this, 'PATCH', endpoint, body);
                    } else if (operation === 'query') {
                        const query = this.getNodeParameter('query', i) as string;
                        const endpoint = `/${project}/_apis/wit/wiql`;
                        const body = { query };
                        const queryResult = await azureDevOpsApiRequest.call(this, 'POST', endpoint, body);

                        if (queryResult.workItems && queryResult.workItems.length > 0) {
                            const ids = queryResult.workItems.map((wi: any) => wi.id).join(',');
                            const endpoint = `/${project}/_apis/wit/workitems?ids=${ids}`;
                            responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                            responseData = handleWorkItemPagination(responseData);
                        } else {
                            responseData = [];
                        }
                    } else if (operation === 'getAll') {
                        const workItemType = this.getNodeParameter('workItemType', i, '') as string;
                        const limit = this.getNodeParameter('limit', i, 25) as number;

                        let endpoint = `/${project}/_apis/wit/workitems`;
                        if (workItemType) endpoint += `?types=${workItemType}`;

                        responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                        responseData = handleWorkItemPagination(responseData).slice(0, limit);
                    }
                } else if (resource === 'identity') {
                    // Identity operations
                    if (operation === 'get') {
                        const identityId = await getIdentityId.call(this, i);
                        const endpoint = `/_apis/identities/${identityId}`;
                        responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                    } else if (operation === 'getByDescriptor') {
                        const descriptor = this.getNodeParameter('descriptor', i) as string;
                        const endpoint = `/_apis/identities?descriptors=${descriptor}`;
                        responseData = await azureDevOpsApiRequest.call(this, 'GET', endpoint);
                        responseData = responseData.value[0];
                    }
                }

                if (Array.isArray(responseData)) {
                    returnData.push(...this.helpers.constructExecutionMetaData(
                        this.helpers.returnJsonArray(responseData),
                        { itemData: { item: i } },
                    ));
                } else if (responseData !== undefined) {
                    returnData.push(
                        ...this.helpers.returnJsonArray(responseData)
                    );
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: String(error) } });
                } else {
                    throw error;
                }
            }
        }
        return [returnData];
    }
}