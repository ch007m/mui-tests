import './Version.css'
import { Autocomplete, TextField } from "@mui/material";
import {useEffect, useState} from "react";

export interface Platform {
    platformKey: string;
    name: string;
    currentStreamId: string;
    versions: Version[];
}

export interface Version {
    id: string;
    name: string;
    lts: boolean;
}


function displayVersions(versions: Version[]){
    versions.forEach(v => console.log("Version: " + v.id + ", lts: " + v.lts));
}

function QuarkusVersion() {
    const [_, setOpen] = useState(false);
    const [quarkusVersion, setQuarkusVersion] = useState<Version[]>([]);
    const [recommendedVersion, setRecommendedVersion] = useState<String | undefined>();
    const [platform, setPlatform] = useState<Platform[]>([]);
    const [data, setData] = useState(null);

    const codeQuarkusUrl = 'https://code.quarkus.io';
    const apiUrl = `${codeQuarkusUrl}/api/platforms`

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(apiUrl);
            const newData = await response.json();
            setData(newData);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data) {
            setPlatform(data.platforms)
            setQuarkusVersion(data.platforms[0].streams)
        }
    }, [data]);

    useEffect(() => {
        if (platform) {
            if (Array.isArray(platform)) {
                platform.forEach(p => {
                    //console.log("Platform : " + p.name);
                    console.log("Current version : " + p["current-stream-id"]);
                    setRecommendedVersion(p["current-stream-id"])
                });
            }
        }
    }, [platform]);

    useEffect(() => {
        if (quarkusVersion) {
            if (Array.isArray(quarkusVersion)) {
                displayVersions(quarkusVersion);
            }
        }
    }, [quarkusVersion]);

    return (
        <Autocomplete
            id="quarkus-versions"
            options={quarkusVersion}
            getOptionLabel={(quarkusVersion) => quarkusVersion.id}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            defaultValue={recommendedVersion}
            value={null}
            sx={{ width: 300, marginTop: 6, marginX: "auto" }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Select a quarkus version"
                    size="small"
                />
            )}
        />
    );
}

export default QuarkusVersion;
