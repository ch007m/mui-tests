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
    lts: boolean;
}


function displayVersions(versions: Version[]){
    versions.forEach(v => console.log("Version: " + v.id + ", lts: " + v.lts));
}

function QuarkusVersion() {
    const [quarkusVersion, setQuarkusVersion] = useState<Version[]>([]);
    const [recommendedQuarkusVersion, setRecommendedQuarkusVersion] = useState<string>();
    const [defaultQuarkusVersion, setDefaultQuarkusVersion] = useState<Version>();
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
                    console.log("Recommended version : " + p["current-stream-id"]);
                    setRecommendedQuarkusVersion(p["current-stream-id"])
                });
            }
        }
    }, [platform]);

    useEffect(() => {
        if (quarkusVersion && recommendedQuarkusVersion) {
            if (Array.isArray(quarkusVersion)) {
                displayVersions(quarkusVersion);
                quarkusVersion.forEach((v, idx) => {
                    if (v.id === recommendedQuarkusVersion) {
                        console.log("Version matches the recommended: " + v.id + ", " + v.lts)
                        setDefaultQuarkusVersion(quarkusVersion[idx])
                    } else {
                        console.log("No version matching the recommended: " + recommendedQuarkusVersion)
                    }
                })
            }
        }
    }, [quarkusVersion]);

    return (
        <Autocomplete
            id="quarkus-versions"
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={quarkusVersion}
            getOptionLabel={(quarkusVersion) => quarkusVersion.id}
            // That don't work using Version array or Version object => defaultValue={defaultQuarkusVersion}
            // BUT that works using => {{id: "3.8", lts: false}}
            defaultValue={{id: "3.8", lts: false}}
            //defaultValue={defaultQuarkusVersion}
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
