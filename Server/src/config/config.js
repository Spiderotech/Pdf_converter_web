import dotenv from "dotenv"
dotenv.config()

export default {

    port: process.env.PORT || "3000",
    mongo: {
        uri: process.env.MONGO_URI || ""
    },
    ACESS_TOKEN_SCERET: process.env.ACCESS_TOKEN_SECRET || "",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
    



}
