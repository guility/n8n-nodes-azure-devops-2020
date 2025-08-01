import {
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

// eslint-disable-next-line n8n-nodes-base/cred-class-name-unsuffixed
export class AzureDevOpsServerApi implements ICredentialType {
    name = 'azureDevOpsServerApi';
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-display-name-missing-api
    displayName = 'Azure DevOps Server 2020 API';
    documentationUrl = 'https://learn.microsoft.com/ru-ru/rest/api/azure/devops';
    properties: INodeProperties[] = [
        {
            displayName: 'Server URL',
            name: 'server',
            type: 'string',
            default: '',
            placeholder: 'https://dev.azure.com/{organization}',
            description: 'URL of your Azure DevOps Server instance',
            required: true,
        },
        {
            displayName: 'Personal Access Token',
            name: 'personalAccessToken',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            description: 'Create in Azure DevOps: User Settings > Personal Access Tokens',
            required: true,
        },
    ];
}

