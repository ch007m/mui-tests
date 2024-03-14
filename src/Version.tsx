import './Version.css'
import {Autocomplete, TextField} from "@mui/material";
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


function displayVersions(versions: Version[]) {
    versions.forEach(v => console.log("Quarkus: " + v.id + ", lts: " + v.lts));
}

function QuarkusVersion() {
    const [quarkusVersion, setQuarkusVersion] = useState<Version[]>([]);
    //const [recommendedQuarkusVersion, setRecommendedQuarkusVersion] = useState<string>();
    //const [_, setDefaultQuarkusVersion] = useState<Version>();
    const [platform, setPlatform] = useState<Platform[]>([]);
    //const [data, setData] = useState(null);
    //const hasPageBeenRendered = useRef(false);
    //const [query, setQuery] = useState('');

    const codeQuarkusUrl = 'https://code.quarkus.io';
    const apiUrl = `${codeQuarkusUrl}/api/platforms`

    let defaultQuarkusVersion: Version;
    // let defaultQuarkusVersion: Version = {id: "3.8", lts: false};
    let recommendedQuarkusVersion: string;

    const fetchData = async () => {
        const response = await fetch(apiUrl);
        const data = await response.json();
        //setData(newData);
        setPlatform(data.platforms)
        setQuarkusVersion(data.platforms[0].streams)
    }

    useEffect(() => {
        fetchData()

        if (platform.length > 0) {
            //setQuarkusVersion(platform[0].streams)
            platform.forEach(p => {
                //console.log("Platform : " + p.name);
                console.log("Recommended version is: " + p["current-stream-id"]);
                recommendedQuarkusVersion = p["current-stream-id"];
            });
        }

        if (quarkusVersion.length > 0 && recommendedQuarkusVersion) {
            displayVersions(quarkusVersion);
            quarkusVersion.forEach((v) => {
                if (v.id === recommendedQuarkusVersion) {
                    // setDefaultQuarkusVersion(quarkusVersion[idx])
                    defaultQuarkusVersion = v
                    console.log("Quarkus version matches the recommended !")
                }
            })
        }
    }, []);

    if (platform.length > 0) {
        return (
            <Autocomplete
                id="quarkus-versions"
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={quarkusVersion}
                getOptionLabel={(quarkusVersion) => quarkusVersion.id}
                // That don't work using a state object: Version[] or Version => defaultValue={defaultQuarkusVersion}
                // Same remark if we use a variable: let defaultQuarkusVersion: Version;
                // BUT that works using => {{id: "3.8", lts: false}}
                //defaultValue={{id: "3.8", lts: false}}

                //defaultValue={{ ...defaultQuarkusVersion }}
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
        return <>Still loading...</>;
    }
}

export default QuarkusVersion;
