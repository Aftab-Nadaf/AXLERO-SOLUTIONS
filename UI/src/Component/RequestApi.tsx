import React,{ useState } from "react";




const RequestApi = () => {
    const [selectApiPath, setSelectApiPath] = useState<string | number | readonly string[] | undefined>("");
    const [id, setId] = useState<string | number | readonly string[] | undefined>(0);
    const handleChangepath = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectApiPath(event.target.value);
    };
    const handleChangeId = (event: React.ChangeEvent<HTMLInputElement>) => {
        setId(event.target.value);
    };
    const handleSubmit = ()=>{
        return `${setSelectApiPath}/${setId}`;
    };


    return (
        <div className="container">
            <form>
                <label>Select Type of Service</label>
                <br />
                <select className="apipath" value={selectApiPath} onChange={handleChangepath}>
                    <option value="products">products</option>
                    <option value="inventory">Inventory</option>
                    <option value="recommendations">Recommendation</option>
                </select>
                <br />
                <label>Enter ID</label>
                <br />
                <input type="number" value={id} className="inputid" onChange={handleChangeId} />
                <br />
                <button onClick={handleSubmit}>Get </button>
                <button type="reset">Reset</button>
            </form>
        </div>
    );
}

export default RequestApi;