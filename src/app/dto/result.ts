export interface StatusResult{
    status : number ;
    messages : string[] |null;
    


}



export interface SingleDataResult<T> extends  StatusResult{
        data:T | null;


}


export interface ListDataResult<t> extends StatusResult{
    listData : t[] | null ;
    totalRecords: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
}

export interface FileResult extends StatusResult {
    filePath: string;
    fileName: string;

}





