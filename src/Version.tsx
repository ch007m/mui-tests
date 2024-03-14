import './Version.css'
import {Autocomplete, TextField} from "@mui/material";
import {useRef, useEffect, useState} from "react";

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


function displayVersions(versions: Version[]) {
    versions.forEach(v => console.log("Quarkus: " + v.id + ", lts: " + v.lts));
}

function QuarkusVersion() {
    const [platform, setPlatform] = useState<Platform[]>([]);
    const [quarkusVersion, setQuarkusVersion] = useState<Version[]>([]);

    const [recommendedQuarkusVersion, setRecommendedQuarkusVersion] = useState<string>();
    const [defaultQuarkusVersion, setDefaultQuarkusVersion] = useState<Version>();

    // const hasPageBeenRendered = useRef(false);
    // const [query, setQuery] = useState('');

    const codeQuarkusUrl = 'https://code.quarkus.io';
    const apiUrl = `${codeQuarkusUrl}/api/platforms`

    const fetchData = async () => {
        const response = await fetch(apiUrl);
        const newData = await response.json();
        setPlatform(newData.platforms)
        setQuarkusVersion(newData.platforms[0].streams)
        console.log("Got data")
    }

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        platform.forEach(p => {
            //console.log("Platform : " + p.name);
            console.log("Recommended version is: " + p["current-stream-id"]);
            setRecommendedQuarkusVersion(p["current-stream-id"]);
        });
    }, [platform]);

    useEffect(() => {
        //displayVersions(quarkusVersion);
        console.log("Try to match the recommended version: " + recommendedQuarkusVersion);
        quarkusVersion.forEach((v) => {
            console.log("Quarkus version: " + v.id)
            if (v.id === recommendedQuarkusVersion) {
                setDefaultQuarkusVersion({id: v.id + " (RECOMMENDED)"})
                // defaultQuarkusVersion = v
                console.log("Quarkus version matches the recommended !")
            }
        })
    }, [recommendedQuarkusVersion]);

    if (defaultQuarkusVersion) {
        return (
            <Autocomplete
                id="quarkus-versions"
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={quarkusVersion}
                getOptionLabel={(quarkusVersion) => quarkusVersion.id}
                defaultValue={defaultQuarkusVersion}

                sx={{width: 300, marginTop: 6, marginX: "auto"}}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select a quarkus version"
                        size="small"
                    />
                )}
            />)
    } else {
        return (<div>Waiting to get the default Quarkus version ...</div>)
    }

}

export default QuarkusVersion;
