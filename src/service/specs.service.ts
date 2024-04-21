
import specsModel from "../model/specs.model";
import { SpecsDocument } from "../model/specs.model";

type Types = keyof SpecsDocument

export const createSpecs = async (name: string, specType: Types) => {
    name = name.toLowerCase().trim();
    const value = createValueFromName(name);
    try {
        // check if category already exists
        const existingCategory = await specsModel.findOne({ [`${specType}.name`]: name, [`${specType}.isDeleted`]: false }).lean();
        if (existingCategory) {
            //throw new Error("Looks like the name already exists.");
            return;
        }
        return await specsModel.updateOne(
            {},
            {
                $push: {
                    [`${specType}`]: {
                        name,
                        value
                    }
                }
            },
            { upsert: true }
        );
    } catch (err: any) {
        throw new Error(err);
    }
}

export const updateSpec = async (id: string, newName: string, specType: Types) => {

    const name = newName.toLowerCase().trim();
    const value = createValueFromName(name);

    try {
        return await specsModel.updateOne(
            { [`${specType}._id`]: id },
            {
                $set: {
                    [`${specType}.$.name`]: name,
                    [`${specType}.$.value`]: value
                }
            }
        );

    } catch (err) {
        console.error(err);
        throw new Error('Error Occured while updating the spec.');
    }
}

export const deleteSpec = async (id: string, specType: Types) => {
    try {
        // set is deleted to true
        return await specsModel.updateOne(
            { [`${specType}._id`]: id },
            {
                $set: {
                    [`${specType}.$.isDeleted`]: true
                }
            }
        );
    } catch (err) {
        throw new Error('Error Occured while deleting the spec.');
    }
}

export const getSpecs = async (specType: Types) => {
    try {
        // get the id of first document
        const data = await specsModel.findOne({}).lean();
        const activeSpecs = data?.[`${specType}`].filter((spec: any) => !spec.isDeleted);
        return activeSpecs;
    } catch (err) {
        console.error('Error getting categories:', err);
        throw new Error('Error getting categories.');
    }
}



const createValueFromName = (name: string) => {
    return name.toLowerCase().trim().replace(/ /g, "-");
}