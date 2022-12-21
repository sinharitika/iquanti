import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  let [visibility, setVisibility] = useState(false);
  let [filter, setFilter] = useState(false);
  let [boxId, setboxId] = useState("");
  let [data, setData] = useState([]);
  function toggle(val) {
    //function for filter box visibility
    if (val === boxId && boxId !== "") {
      setVisibility(false);
    } else {
      setVisibility(true);
    }
    setboxId(val);
  }
  function fetch_data() {
    //fetch data from api
    let requestOptions = {
      method: "GET",
    };
    fetch("https://dev1api.credello.com/static-products", requestOptions)
      .then((response) => response.json())
      .then((result) => setData(result))
      .catch((error) => console.log("error", error));
  }
  function filter_data(val) {
    //filter data
    let requestOptions = {
      method: "GET",
    };
    fetch("https://dev1api.credello.com/static-products", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (val === "apr_min") {
          result = result.sort((result, b) =>
            result.apr.min > b.apr.min ? 1 : -1
          );
        } else if (val === "apr_max") {
          result = result.sort((result, b) =>
            result.apr.max > b.apr.max ? 1 : -1
          );
        } else if (val === "orig_fee") {
          result = result.sort((result, b) =>
            result.origination_fee.min > b.origination_fee.min ? 1 : -1
          );
        }
        setData(result);
      })
      .catch((error) => console.log("error", error));
  }
  function get_pros(val) {
    //separate pros and add them in a single array
    val = val.split("|\n");
    let html = "<ul class='pros_ul'>";
    for (let i = 0; i < val.length; i++) {
      html += "<li>" + val[i] + "</li>";
    }
    html += "</ul>";
    return html;
  }
  function get_cons(val) {
    //separate cons and add them in a single array
    val = val.split("|\n");
    let html = "<ul class='cons_ul'>";
    for (let i = 0; i < val.length; i++) {
      html += "<li>" + val[i] + "</li>";
    }
    html += "</ul>";
    return html;
  }
  useEffect(() => {
    fetch_data(); //call to fetch data from api
  }, []);
  return (
    <div className="App">
      <div>
        <div className="sort_by_div">
          <span onClick={() => setFilter(!filter)}>Sort by </span>
          {/* filter div */}
          <ul className={!filter ? "d-none filter_div" : "filter_div"}>
            <li onClick={() => filter_data("apr_min")} val="apr.min">
              APR Min
            </li>
            <li onClick={() => filter_data("apr_max")} val="apr.max">
              APR Max
            </li>
            <li val="500">Monthly Payment</li>
            <li
              onClick={() => filter_data("orig_fee")}
              val="origination_fee.min"
            >
              Origination Fee
            </li>
          </ul>
          {/* filter div */}
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-12">
              {data !== "" &&
                data.map((value, index) => {
                  return (
                    <div className="row boxes" key={index}>
                      <div className="col-md-4">
                        <div className="left_container">
                          <h6>{value.lender_name}</h6>
                          <img
                            className="w-100"
                            alt="imgg"
                            src={value.lender_image}
                          />
                          <button className="btn">Get Offer</button>
                          <div className="bottom">on Credello</div>
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="right_container">
                          <ul className="first_ul">
                            <li>
                              {value.apr.min}% - {value.apr.min}%*
                            </li>
                            <li>$500</li>
                            <li>{value.origination_fee.min}%</li>
                          </ul>
                          <p className="first_p">
                            <span>Good For: </span>
                            <span>{value.best_for}</span>
                          </p>
                          <p className="second_p">Pros & Cons</p>
                          <div className="row">
                            <div className="col-md-6">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: get_pros(value.detailed_info.pro),
                                }}
                              ></div>
                            </div>
                            <div className="col-md-6">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: get_cons(value.detailed_info.con),
                                }}
                              ></div>
                            </div>
                          </div>
                          <div
                            className={
                              visibility && boxId === index
                                ? "hide_show_div"
                                : "d-none hide_show_div"
                            }
                          >
                            <hr />
                            <h5>Qualification Requirements</h5>
                            <ul className="qual_ul">
                              <li>
                                <span>Min. Credit Score:</span>
                                <span>
                                  {value.detailed_info.min_credit_score}+
                                </span>
                              </li>
                              <li>
                                <span>Max. DTI ratio:</span>
                                <span>
                                  {value.detailed_info.max_debt_income_ratio}
                                </span>
                              </li>
                            </ul>
                            <hr />
                            <h5>Fees & Penality</h5>
                            <ul className="qual_ul">
                              <li>
                                <span>Late Penalties:</span>
                                <span>
                                  {value.detailed_info.late_penalties}
                                </span>
                              </li>
                              <li>
                                <span>Prepayment Fees:</span>
                                <span>
                                  {value.detailed_info.prepayment_fee}
                                </span>
                              </li>
                              <li>
                                <span>Returned Payment Fees:</span>
                                <span>{value.returned_payment_fee}</span>
                              </li>
                            </ul>
                          </div>
                          <div className="box_last_div">
                            <a onClick={() => toggle(index)}>
                              {visibility && boxId === index
                                ? "Show Less"
                                : "More"}
                            </a>
                          </div>
                          <div
                            className={
                              visibility && boxId === index
                                ? "btns_div"
                                : "d-none btns_div"
                            }
                          >
                            <ul>
                              <li>
                                <button className="btn">
                                  Read Full Review
                                </button>
                              </li>
                              <li>
                                <a
                                  rel="noreferrer"
                                  href={value.apply_url}
                                  target="_blank"
                                  className="button"
                                >
                                  Get Offer
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
