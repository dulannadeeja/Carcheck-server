import { scheduleJob, Job } from "node-schedule";
import { updateListings, getEarliestEndDate } from "../service/listing.service";
import { ListingState, ListingType } from "../model/listing.model";

class ListingScheduler {
    job: Job | null;

    constructor() {
        console.log("ListingScheduler instantiated");
        this.job = null;
    }

    async endListing() {
        console.log("Attempting to end listings");
        try {
            const filters = {
                status: ListingState.active,
                endDate: { $lt: new Date() }
            };

            const updates = {
                $switch: {
                    branches: [
                        {
                            case: { $and: [{ listingType: ListingType.auction }, { 'auction.bids': { $size: 0 } }] },
                            then: { status: ListingState.unsold }
                        },
                        {
                            case: { $and: [{ listingType: ListingType.auction }, { 'auction.bids': { $gt: [] } }] },
                            then: { status: ListingState.sold }
                        },
                        {
                            case: { listingType: ListingType.fixedPrice },
                            then: { status: ListingState.unsold }
                        }
                    ],
                    default: { status: ListingState.active }
                }
            };

            // Update listings based on conditions
            await updateListings(filters, updates);
            console.log("Listings successfully updated.");
        } catch (error) {
            console.error("Error during listing updates:", error);
        }

        // Always try to reschedule, even if there was an error
        this.scheduleNextEndListingJob();
    }

    async scheduleNextEndListingJob() {
        try {
            const earliestEndDate = await getEarliestEndDate({ status: ListingState.active });

            const now = new Date();
            let date = new Date(now.getTime() + 60000);  // Default to checking again in one minute

            if (earliestEndDate) {
                const earliestDate = new Date(earliestEndDate);
                if (earliestDate > now) {
                    date = earliestDate;
                }
            }

            // Cancel the existing job if there is one
            if (this.job) {
                this.job.cancel();
            }
            // Schedule the new job
            this.job = scheduleJob(date, () => this.endListing());
            console.log(`Next job scheduled at ${date.toLocaleString()}`);
        } catch (error) {
            console.error("Error scheduling the next job:", error);
            // Try rescheduling again in one minute if there was an error
            const fallbackDate = new Date(new Date().getTime() + 60000);
            this.job = scheduleJob(fallbackDate, () => this.endListing());
            console.log(`Rescheduled job at fallback time ${fallbackDate.toLocaleString()} due to error.`);
        }
    }

    async start() {
        console.log("Starting job immediately");
        await this.endListing();
    }
}

export default ListingScheduler;
