import {Request, Response, NextFunction} from 'express';
import { AnyZodObject } from 'zod';

const validateResources =(schema:AnyZodObject)=> (req: Request, res: Response, next: NextFunction) => {
    try{
        schema.parse({
            body:req.body,
            query:req.query,
            params:req.params
        });
    }
    catch(err:any){
        res.status(400).send(err.errors);
        return;
    }
    next();
};

export default validateResources;