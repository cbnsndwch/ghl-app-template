// Workflows Models

export interface WorkflowSchema {
    id?: string;
    name?: string;
    status?: string;
    version?: number;
    createdAt?: string;
    updatedAt?: string;
    locationId?: string;
}

export interface GetWorkflowSuccessfulResponseDto {
    workflows?: WorkflowSchema[];
}
