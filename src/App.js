import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import './App.css';
import { useState, React, useEffect } from 'react'
import InfoBox from './InfoBox';
import Table from './Table'
import {sortData} from './utilities'
import Graph from './Graph'
function App() {
  const [countries, setCountries] = useState([])
  const [coun, setCoun] = useState("Worldwide")
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData,setTableData] = useState([])
  const [casesType, setCasesType] = useState("cases");
  //to render initial Worlwide cases
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all').then(r => r.json()).then(d => {
      setCountryInfo(d)
    })
  }, [])
  //table

  //  drop down
  useEffect(() => {//its runs when component loads and state var chances
    //async ->send a req ,wait for server to send back
    const getCountriesData = async () => {
      await fetch(
        "https://disease.sh/v3/covid-19/countries"
      ).then(responce => responce.json()).then(data => {
        const countries = data.map(c => (
          {
            name: c.country,
            value: c.countryInfo.iso2,
          }
        ))
        const newData=sortData(data)
        setCountries(countries)
        setTableData(newData)
        
      })
    }
    getCountriesData()//calling async function
  }, [])

  const goChange = async (e) => {
    const ct = e.target.value
    //to get cases as per countries
    const url = ct === 'Worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${ct}`

    await fetch(url).then(r => r.json()).then(d => {
      setCoun(ct)
      setCountryInfo(d)//data from country responce
    })
  }
  console.log("info:", countryInfo)
  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app_drop">
            <Select  //to create menu bar
              variant="outlined"
              onChange={goChange}
              value={coun}
            >
              {/* menu items */}
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {countries.map(
                (c) => (
                  <MenuItem value={c.value} key={c.value}>{c.name}</MenuItem>
                )
              )
              }
            </Select>
          </FormControl>
        </div>
        {/* infobox */}
        <div className="app_info">
          <InfoBox onClick={(e) => setCasesType("cases")} title="Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox  onClick={(e) => setCasesType("recovered")} title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox onClick={(e) => setCasesType("deaths")} title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>
        {/* map */}
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Covid Update</h3>
          <Table countries={tableData}/>
          <h3>Worldwide new cases</h3>
          {/* graph */}
           <Graph casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
} export default App;