import { Express, Request, Response } from "express";
import validateResources from "../middleware/validateResources";
import { createVehicleSchema } from "../schema/vehicle.schema";
import { createVehicleHandler, getVehiclesByMakeHandler } from "../controller/vehicle.controller";
import { createVehicle } from "../service/vehicleService";
import { vehicleModels } from "../static/vehicleModels";
import VehicleModel, { vehicleCategoryArray, VehicleDocument, vehicleMakeArray } from "../model/vehicle.model";


function vehicleRoutes(app: Express) {
    app.post('/api/vehicles', validateResources(createVehicleSchema), createVehicleHandler),
        app.get('/api/vehicles/models', getVehiclesByMakeHandler)
    app.get('/api/vehicles/save', async (req: Request, res: Response) => {

        // delete duplicate vehicles with same make and model
        vehicleModels.forEach(async (vehicle) => {

            VehicleModel.find({
                make: vehicle.Make.toLocaleLowerCase(),
                vehicleModel: vehicle.Model.toLocaleLowerCase(),
            }).then((vehicle) => {
                // if found more than 1 vehicle with same make and model delete all except 1
                if (vehicle.length > 1) {
                    vehicle.forEach((v, index) => {
                        if (index !== 0) {
                            VehicleModel.findByIdAndDelete(v._id).then((result) => {
                                console.log("result: ", result)
                            }).catch((error) => {
                                console.log(error)
                            })
                        }
                    })
                }
            }).then((result) => {
                console.log(result)
            }).catch((error) => {
                console.log(error)
            })
        })

        // vehicleModels.forEach(async (vehicle) => {
        //     // category can have 3 formats 
        //     // 1. suv
        //     // 2. sedan, convertible
        //     // 3. coupe/sedan
        //     // i need to split to single words and include them in the array
        //     const finalCategories: string[] = [];
        //     if (vehicle.Category.includes('/')) {
        //         const categories = vehicle.Category.split('/');
        //         categories.forEach((cat) => {
        //             finalCategories.push(cat.trim().toLowerCase())
        //         })
        //     } else if (vehicle.Category.includes(',')) {
        //         const categories = vehicle.Category.split(',');
        //         categories.forEach((cat) => {
        //             finalCategories.push(cat.trim().toLowerCase())
        //         })
        //     }
        //     else {
        //         finalCategories.push(vehicle.Category.trim().toLowerCase())
        //     }

        //     const vehicleData: VehicleDocument = {
        //         make: vehicle.Make.toLocaleLowerCase(),
        //         vehicleModel: vehicle.Model.toLocaleLowerCase(),
        //         category: finalCategories
        //     }
        //     const result = await createVehicle(vehicleData)
        //     console.log(result)

        //     if (vehicleMakeArray.some(vehicleMake => vehicleMake.toLocaleLowerCase() === vehicle.Make.toLocaleLowerCase())) {
        //         vehicleData.category.forEach((category) => {
        //             if (!vehicleCategoryArray.some(vehicleCategory => vehicleCategory.toLocaleLowerCase() === category.toLocaleLowerCase())) {
        //                 console.log('Invalid category: ', category)
        //                 return
        //             }
        //         })
        //         VehicleModel.findOneAndDelete({
        //             make: vehicleData.make.toLocaleLowerCase(),
        //             vehicleModel: vehicleData.vehicleModel.toLocaleLowerCase(),
        //         }).then((vehicle) => {
        //             createVehicle(vehicleData)
        //         }).then((result) => {
        //             console.log(result)
        //         }).catch((error) => {
        //             console.log(error)
        //         })


        //     }

        // })
        res.send('Vehicles saved')
    });
}

export default vehicleRoutes;