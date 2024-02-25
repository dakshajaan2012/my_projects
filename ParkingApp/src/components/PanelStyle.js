const PanelComponent = ({ travelMode, isMobile }) => {
  return (
    <div
      id="panel"
      style={{
        height: isMobile ? "400px" : "600px",
        overflowY: "auto",
        marginTop: "20px",
        marginBottom: "100px",
        textAlign: "left",
        alignItems: "center",
        alignContent: "center",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "5px",
        backgroundColor: "#e3f2fd",
      }}
    >
      <style>
        {`
            .adp-directions, .adp-summary, .adp-duration, .adp-distance {
            margin-bottom: 10px;
            font-size: ${isMobile ? " 0.75em" : "1em"};
            }
            .adp-text {
            background-color: #01579b;
            color: #fff;
            font-weight: bold;
            font-size: ${isMobile ? " 0.75em" : "1em"};
            }
            .adp-summary {
            color: #01579b;
            font-weight: bold;
            font-size: ${isMobile ? " 0.75em" : "1em"};
            }
            .adp-step, .adp-substep {
            border-top: 1px solid #cdcdcd;
            margin: 0;
            padding: 0.3em 3px 0.3em 3px;
            vertical-align: top;
            width: auto; 
            }
            .adp-substep:nth-child(1) {
            width: auto;
            }
            .adp-substep:nth-child(2) {
            width: 30px;
            font-weight: bold;
            }
            .adp-substep:nth-child(3) {
            width: 100%;
            }
            .adp-substep:last-child {
            width: ${travelMode === "TRANSIT" ? "800px" : "100% auto"};
            }
            .adp-list {
            position: initial;
            background: #bbdefb;
            border: 2px solid #bbdefb;
            border-radius: 8px;
            color: #78909c;
            z-index: 0;
            font-size: ${isMobile ? " 0.75em" : "1em"};
            }
            .adp-listheader {
            font-weight: bold;
            font-size: ${isMobile ? " 15px" : "20px"};
            color: #fff;
            background-color: #2196f3;
            }

            .adp-list-item {
            border-bottom: 1px solid #ddd;
            padding: 10px;
            }
            .adp-listsel {
                background: #64b5f6;
                font-weight: bold;
                color: #01579b;
            }
            .adp-summary-duration {
            font-weight: bold;

            }
            .adp-legal, .adp-agencies {
            font-size: 8px; 
            }
            .warnbox-content {
            font-size: 8px; 
            }
        `}
      </style>
    </div>
  );
};

export default PanelComponent;
