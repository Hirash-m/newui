 export enum ResultStatusEnum
{
    // Success
    Success = 1,
    Created = 2,
    Accepted = 3,
    
    // Client Errors (بیزینس)
    BadRequest = 100,
    ValidationFailed = 101,
    NotFound = 102,
    Unauthorized = 103,
    Forbidden = 104,
    Conflict = 105,
    
    // Server Errors (فنی)
    InternalError = 500,
    ServiceUnavailable = 501,
    DatabaseError = 502,
    ThirdPartyError = 503
}


export interface StatusResult{
    status : ResultStatusEnum ;
    messages : string[] |null;
     isSuccess: boolean;
    


}



export interface SingleDataResult<T> extends  StatusResult{
    singleData:T | null;


}


export interface ListDataResult<t> extends StatusResult{
    data : t[] | null ;
    totalRecords: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
}

export interface FileResult extends StatusResult {
    filePath: string;
    fileName: string;

}





