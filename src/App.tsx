import './App.css'
import {Line, XAxis, CartesianGrid, Tooltip, ComposedChart, Bar} from "recharts";
import client from "./data/client.ts";
import Dropzone from "react-dropzone";
import React, {useEffect, useState} from "react";
import DataEditTable from "./components/DataEditTable.tsx";
import {FormControl, FormLabel, Select} from "@chakra-ui/react";

type graphData = {
    name: string,
    [x: string | number | symbol]: unknown
}

function App() {
    const [uploadedData, setUploadedData] = useState<any | null>(null);
    const [graphData, setGraphData] = useState<graphData[]>([]);
    const [xSelectOptions, setXSelectOptions] = useState<string[]>([]);
    const [xSelectValue, setXSelectValue] = useState("");
    const data = []
    for (let i = 0; i < 25; i++) {
        data.push({
            name: "test" + i,
            uv: Math.floor(Math.random() * 20),
            amt: Math.floor(Math.random() * 100),
            pv: Math.floor(Math.random() * 100)
        })
    }

    const handleUpload = async (file: any[]) => {
        const formData = new FormData();
        formData.append("files", file[0]);
        const res = await client.postCSV(formData);
        if (res.status === 200) {
            setUploadedData(res.data);
        }
    }
    const handleXSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setXSelectValue(event.target.value);
    }

    useEffect(() => {
        if (!uploadedData) return;
        const headers = new Set<string>();
        uploadedData.forEach((row: any) => {
            Object.keys(row).forEach(key => headers.add(key));
        });
        const headerArray = Array.from(headers);
        setXSelectOptions(headerArray);
    }, [uploadedData]);

    useEffect(() => {
        if (!uploadedData) return;
        const valueCount = new Map<string,number>();
        const newGraphData: graphData[] = [];
        uploadedData.forEach((x:any) => {
            const prev = valueCount.get(x[xSelectValue]);
            if(prev){
                valueCount.set(
                    x[xSelectValue],
                    prev + 1
                )
            } else {
                valueCount.set(
                    x[xSelectValue],
                    1
                )
            }
        });
        for(const [key,value] of valueCount){
            newGraphData.push({name: key, count: value})
        }
        setGraphData(newGraphData);
    }, [xSelectValue, uploadedData]);

    const xOptionComponents = xSelectOptions.map(x => <option key={x} value={x}>{x}</option>);

    return (
        <>
            <div>
            </div>
            <h1>Upload</h1>
            <Dropzone onDrop={acceptedFiles => handleUpload(acceptedFiles)}>
                {({getRootProps, getInputProps}) => (
                    <section>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                    </section>
                )}
            </Dropzone>
            <DataEditTable data={uploadedData} updateData={setUploadedData}/>
            <div className="card">
                {xSelectOptions.length > 0
                    ? <FormControl>
                        <FormLabel>Group Data By:</FormLabel>
                        <Select
                            value={xSelectValue}
                            onChange={handleXSelect}
                            placeholder="Select X Axis"
                        >
                            {xOptionComponents}
                        </Select>
                    </FormControl>
                    : <></>
                }

                <ComposedChart width={900} height={400} data={graphData}>
                    <Line type="monotone" dataKey="count" stroke="#8895d8"/>
                    <Line type="monotone" dataKey="pv" stroke="#0095d8"/>
                    <Bar dataKey="count"/>
                    <CartesianGrid stroke="#ccc"/>
                    <XAxis dataKey="name"/>
                    <Tooltip/>
                </ComposedChart>
            </div>
        </>
    )
}

export default App
