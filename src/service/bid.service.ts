import BidModel, { BidInput } from '../model/bid.model';

export const createBid = (input: BidInput) =>{
    try{
        return BidModel.create(input);
    }catch(err: any){
        throw new Error(err);
    }
}