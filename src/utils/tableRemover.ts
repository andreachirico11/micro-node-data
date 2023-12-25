import { CollectionConfigModel } from "../models/collectionConfig";
import { log_error, log_info } from "./log";

/**
 * Singleton used between middlewares to delete a fresh table if 
 * other error occurs in the process
 */
class TableRemover {
    private _id: string;
    public scheduleTableForElimination(_id: string) {
     this._id = _id;
    }

    public reset() {
        this._id = null;
    }

    public async eliminateTableIfScheduled() {
        if (!this._id) return;
        try {
            const result = !!await CollectionConfigModel.findByIdAndDelete(this._id);
            if(result) log_info("Table " + this._id + " has been deleted");
            this.reset();
        } catch(e) {
            log_error("Error Eliminating table")
        }
    }

}

export default new TableRemover();