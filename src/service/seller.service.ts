import listingModel from "../model/listing.model";

export const getDrafts = async (userId: string) => {
    try {
        const drafts = await listingModel.find();
        return drafts;
    }
    catch (err: any) {
        throw new Error(err);
    }
}

export const getActiveListings = (userId:string) => {
    try{
        const activeListings = listingModel.find();
        return activeListings;
    }catch(err:any){
        throw new Error(err);
    }
}