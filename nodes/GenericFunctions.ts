import {
    IExecuteFunctions,
    ILoadOptionsFunctions,
    IHttpRequestMethods,
    IHttpRequestOptions,
    NodeOperationError,
} from 'n8n-workflow';

export async function azureDevOpsApiRequest(
    this: IExecuteFunctions | ILoadOptionsFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: any = {},
    headers: Record<string, string> = {},
): Promise<any> {
    const credentials = await this.getCredentials('azureDevOpsServerApi');
    const baseUrl = (credentials.server as string).replace(/\/$/, '');
    const accessToken = credentials.personalAccessToken as string;

    const options: IHttpRequestOptions = {
        method,
        url: `${baseUrl}${endpoint}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`:${accessToken}`).toString('base64')}`,
            ...headers,
        },
        json: true,
    };

    if (Object.keys(body).length > 0) {
        options.body = body;
    }

    return this.helpers.httpRequest(options);
}

export async function getProject(this: IExecuteFunctions, index: number): Promise<string> {
    return this.getNodeParameter('project', index) as string;
}

export async function getRepositoryId(
    this: IExecuteFunctions | ILoadOptionsFunctions,
    index: number,
    project: string,
): Promise<string> {
    const repositoryName = this.getNodeParameter('repository', index) as string;
    const endpoint = `/${project}/_apis/git/repositories`;
    const response = await azureDevOpsApiRequest.call(this, 'GET', endpoint);

    if (!response.value) {
        throw new NodeOperationError(this.getNode(), 'No repositories found');
    }

    const repository = response.value.find((repo: any) =>
        repo.name.toLowerCase() === repositoryName.toLowerCase()
    );

    if (!repository) {
        throw new NodeOperationError(this.getNode(), `Repository "${repositoryName}" not found`);
    }

    return repository.id;
}

export async function getPipelineId(
    this: IExecuteFunctions | ILoadOptionsFunctions,
    index: number,
    project: string,
): Promise<number> {
    const pipelineName = this.getNodeParameter('pipeline', index) as string;
    const endpoint = `/${project}/_apis/pipelines`;
    const response = await azureDevOpsApiRequest.call(this, 'GET', endpoint);

    if (!response.value) {
        throw new NodeOperationError(this.getNode(), 'No pipelines found');
    }

    const pipeline = response.value.find((pipe: any) =>
        pipe.name.toLowerCase() === pipelineName.toLowerCase()
    );

    if (!pipeline) {
        throw new NodeOperationError(this.getNode(), `Pipeline "${pipelineName}" not found`);
    }

    return pipeline.id;
}

export async function getWikiId(
    this: IExecuteFunctions | ILoadOptionsFunctions,
    index: number,
    project: string,
): Promise<string> {
    const wikiName = this.getNodeParameter('wiki', index) as string;
    const endpoint = `/${project}/_apis/wiki/wikis`;
    const response = await azureDevOpsApiRequest.call(this, 'GET', endpoint);

    if (!response.value) {
        throw new NodeOperationError(this.getNode(), 'No wikis found');
    }

    const wiki = response.value.find((w: any) =>
        w.name.toLowerCase() === wikiName.toLowerCase()
    );

    if (!wiki) {
        throw new NodeOperationError(this.getNode(), `Wiki "${wikiName}" not found`);
    }

    return wiki.id;
}

export async function getTeamId(
    this: IExecuteFunctions | ILoadOptionsFunctions,
    index: number,
    project: string,
): Promise<string> {
    const teamName = this.getNodeParameter('team', index) as string;
    const endpoint = `/${project}/_apis/teams`;
    const response = await azureDevOpsApiRequest.call(this, 'GET', endpoint);

    if (!response.value) {
        throw new NodeOperationError(this.getNode(), 'No teams found');
    }

    const team = response.value.find((t: any) =>
        t.name.toLowerCase() === teamName.toLowerCase()
    );

    if (!team) {
        throw new NodeOperationError(this.getNode(), `Team "${teamName}" not found`);
    }

    return team.id;
}

export async function getIdentityId(
    this: IExecuteFunctions | ILoadOptionsFunctions,
    index: number,
): Promise<string> {
    const identityName = this.getNodeParameter('identity', index) as string;
    const endpoint = '/_apis/identities?searchFilter=General&filterValue=' + encodeURIComponent(identityName);
    const response = await azureDevOpsApiRequest.call(this, 'GET', endpoint);

    if (!response.value || response.value.length === 0) {
        throw new NodeOperationError(this.getNode(), `Identity "${identityName}" not found`);
    }

    return response.value[0].id;
}

// Pagination handlers
export function handleWikiPagination(response: any): any[] {
    if (response.value) {
        return response.value;
    }
    return [response];
}

export function handleWorkItemPagination(response: any): any[] {
    return response.value || [];
}

export function handlePipelinePagination(response: any): any[] {
    return response.value || [];
}

export function handleGitPagination(response: any): any[] {
    return response.value || [];
}