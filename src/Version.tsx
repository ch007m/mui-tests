import './quarkus.css'
import {Autocomplete, TextField} from "@mui/material";
import {useEffect, useState} from "react";


/* Example returned by code.quarkus.io/api/streams
{
    "javaCompatibility": {
      "recommended": 17,
      "versions": [
        17,
        21
      ]
    },
    "key": "io.quarkus.platform:3.8",
    "lts": false,
    "platformVersion": "3.8.2",
    "quarkusCoreVersion": "3.8.2",
    "recommended": true,
    "status": "FINAL"
  }
 */
export interface Version {
    key: string;
    quarkusCoreVersion: string;
    platformVersion: string;
    lts: boolean;
    recommended: boolean
    javaCompatibility: javaCompatibility[]
    status: string;
}

export interface javaCompatibility {
    recommended: boolean
    versions: string[]
}


function displayVersions(versions: Version[]) {
    versions.forEach(v => console.log("Platform version: " + v.platformVersion, ", Quarkus version: " + v.quarkusCoreVersion + ", lts: " + v.lts + ", recommended: " + v.recommended));
}

function userLabel(v: Version) {
    const key = v.key.split(":")
    if (v.recommended) {
        return `${key[1]} (RECOMMENDED)`;
    } else if (v.status != "FINAL") {
        return `${key[1]} (${v.status})`;
    } else {
        return key[1];
    }
}


function QuarkusVersion() {
    const [quarkusVersion, setQuarkusVersion] = useState<Version[]>([]);
    const [defaultQuarkusVersion, setDefaultQuarkusVersion] = useState<Version>();

    const codeQuarkusUrl = 'https://code.quarkus.io';
    const apiStreamsUrl = `${codeQuarkusUrl}/api/streams`

    const fetchData = async () => {
        const response = await fetch(apiStreamsUrl);
        const newData = await response.json();
        setQuarkusVersion(newData)
        displayVersions(newData)
    }

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        quarkusVersion.forEach(v => {
            if (v.recommended) {
                console.log("Recommended version is: " + v.recommended);
                setDefaultQuarkusVersion({
                    key: v.key,
                    platformVersion: v.platformVersion,
                    quarkusCoreVersion: v.quarkusCoreVersion,
                    lts: v.lts,
                    recommended: v.recommended,
                    javaCompatibility: v.javaCompatibility
                })
            }
        });
    }, [quarkusVersion]);

    if (defaultQuarkusVersion) {
        return (
            <div><Autocomplete

                id="quarkus-versions"
                isOptionEqualToValue={(option, value) => option.key === value.key}
                options={quarkusVersion}
                getOptionLabel={(quarkusVersion) => userLabel(quarkusVersion)}
                defaultValue={defaultQuarkusVersion}
                onChange={(event, v) => console.log("Value selected: " + v.key)}
                sx={{width: 300, marginTop: 6, marginX: "auto"}}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select a quarkus version"
                        size="small"
                    />
                )}
            />
            </div>)
    } else {
        return (<div>Waiting to get the default Quarkus version ...</div>)
    }

}

export default QuarkusVersion;
