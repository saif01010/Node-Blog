class ApiResponse{
    constructor(statusCode,data,message="Success",newdata=null){
        this.status = statusCode;
        this.data = data;
        this.message = message;
        this.newdata = newdata;
        this.success = statusCode <400;
    }
}

export  {ApiResponse};