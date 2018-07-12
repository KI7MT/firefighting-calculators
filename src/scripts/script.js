//------------------------------------------------------------------------------
/*
    Name .........: script.js
    Project ......: Part of the firefighter-calculators project
    Description ..: Provides Calculation and Validation for all forms
    Project URL ..: https://github.com/KI7MT/firefighting-calculators

    Author .......: Greg, Beam, KI7MT, <ki7mt@yahoo.com>
    Copyright ....: Copyright (C) 2018 Greg Beam, KI7MT
    License ......: GPL-3
*/
//------------------------------------------------------------------------------

"use strict";

// Run after page loads
$(function ()
{
    //==========================================================================
    // Common Funcitons and Settings
    //==========================================================================
    
    // hide all error span tags initially
    $("span.help-block").hide();           

    // set focus for First Responder -------------------------------------------
    if(window.location.pathname.indexOf("firstResponder.html") > -1)
    {
        var responderData = {};
        $("#inputResponderName").focus();
    }
    
    // set focus for fire flow -------------------------------------------------
    if(window.location.pathname.indexOf("fireFlow.html") > -1)
    {
        var flowData = {};
        $("#inputLength").focus();
    }
    
    // set focus for water supply ----------------------------------------------
    if(window.location.pathname.indexOf("waterSupply.html") > -1)
    {
        var waterData = {};
        $("#inputTenderCapacity").focus();
    }

    // First Responder OnClick handler -----------------------------------------
    $("#buttonFirstResponderCalculate").on("click", function ()
    {
        if(ffcostValidate())
        {
            sessionStorage.setItem('calcResponderData', JSON.stringify(responderData));
            fireFighterDisplayData();
        }
    });

    // Fire Flow OnClick Handler -----------------------------------------------
    $("#buttonFireFlowCalculate").on("click", function ()
    {
        if(fireFlowValidate())
        {
            sessionStorage.setItem('calcFlowData', JSON.stringify(flowData));
            fireFlowDisplayData();
        }
    });

    // Water Supply OnClick Handler --------------------------------------------
    $("#buttonWaterSupplyCalculate").on("click", function ()
    {
        if(waterSupplyValidate())
        {
            sessionStorage.setItem('calcWaterData', JSON.stringify(waterData));
            waterSupplyDisplayData();
        }
    });    

    // Reset Forms -------------------------------------------------------------
    $('#clearButton').click(function()
    {
        //  First Responder Form
        if(window.location.pathname.indexOf("firstResponder.html") > -1)
        {
            document.getElementById("responderForm").reset();
            $("#inputResponderName").focus();
        }
        
        // Fire Flow Form
        else if(window.location.pathname.indexOf("fireFlow.html") > -1)
        {
            document.getElementById("fireFlowForm").reset();
            $("#inputLength").focus();
        }
        
        // Water Supply Form
        else if(window.location.pathname.indexOf("waterSupply.html") > -1)
        {
            document.getElementById("waterSupplyFormm").reset();
            $("#inputTenderCapacity").focus();
        }
    });

    //==========================================================================
    // First Responder Functions
    //==========================================================================
 
    // Display First Responder Cost Data ---------------------------------------
    function fireFighterDisplayData()
    {
        var retrievedObject = sessionStorage.getItem('calcResponderData');
        responderData = JSON.parse(retrievedObject);

        var content = "";
        var total = 0.00;

         total = +responderData.ppe + +responderData.radio + +responderData.pager;

        // generate html content
        content += "<h3>" + "Cost Estimate" + "</h3>" + "<hr>";
        content += "Name : " + responderData.name + "<br />";
        content += "FF Type : " + responderData.type + "<br />";
        content += "Pager Cost : $" + parseFloat(responderData.pager).toFixed(2) + "<br />";
        content += "PPE Cost : $" + parseFloat(responderData.ppe).toFixed(2) + "<br />";
        content += "Radio Cost $: " + parseFloat(responderData.radio).toFixed(2) + "<br />";
        content += "<hr>";
        content += "<strong>" + "Total  : $" + parseFloat(total).toFixed(2) + "</strong>" + "<br /><br />";
        
        $("#confirmContent").html(content);
        total = 0;
    };
    
    // First Responder Form Validation -----------------------------------------
    function ffcostValidate()
    {
        // verify responderName first
        var formIsValid = true;
        var inputName = $("#inputResponderName");
        if ($.trim(inputName.val()).length >= 2)
        {
            inputName.parent().removeClass("has-error");
            inputName.parent().addClass("has-success");
            inputName.next().hide();  // hide error span
            responderData.name = inputName.val();
        }
        else
        {
            formIsValid = false;
            inputName.parent().addClass("has-error");
            inputName.parent().removeClass("has-success");
            inputName.next().show();  // show error span
        }

         // validate Radio Cost
        var formIsValid = true;
        var inputRADIO = $("#inputRadioCost");
        
        // If input value is a number and > 0
        if (inputRADIO.val() > 0)
        {
            inputRADIO.parent().removeClass("has-error");
            inputRADIO.parent().addClass("has-success");
            inputRADIO.next().hide();  // hide error span
            responderData.radio = inputRADIO.val();
        }
        else
        {
            formIsValid = false;
            inputRADIO.parent().addClass("has-error");
            inputRADIO.parent().removeClass("has-success");
            inputRADIO.next().show();  // show error span
        }
        
        // PPE Costs
        var formIsValid = true;
        var inputPPE = $("#inputPpeCost");
        
        // If input value is a number > 0
        if (inputPPE.val() > 0)
        {
            inputPPE.parent().removeClass("has-error");
            inputPPE.parent().addClass("has-success");
            inputPPE.next().hide();  // hide error span
            responderData.ppe = inputPPE.val();
        }
        else
        {
            formIsValid = false;
            inputPPE.parent().addClass("has-error");
            inputPPE.parent().removeClass("has-success");
            inputPPE.next().show();  // show error span
        }

        // switch for pager type and price
        var pagerType = $("#inputPagerType")
        switch (pagerType.val())
        {
            case 'Alpha Ledgend': responderData.pager = 89;
                break;
            case 'Alpha Elite': responderData.pager = 125;
                break;
            case 'G1 Voice': responderData.pager = 250;
                break;
                default:
                responderData.pager = 0; // error
        }
 
        // get fire-fighter Type and price
        var ffType = $("#inputResponderType")
        responderData.type = ffType.val();

        // if we got this far, form is valid
        return formIsValid;
    };

    //==========================================================================
    // Fire Flow Functions
    //==========================================================================

    // Display Fire Flow Data --------------------------------------------------
    function fireFlowDisplayData()
    {
        // Iowa Formula..: Required volume = (length x width x height) ÷ 100
        // NFA Formula...: Needed fire flow = [(length x width) ÷ 3] x percent of involvement
        // Note..........: NFA flow rates can only be calulated at precentages < 50 involved

        // get session data
        var retrievedObject = sessionStorage.getItem('calcFlowData');
        flowData = JSON.parse(retrievedObject);

        // local function variables
        var content = "";
        var iowaRate = 0;
        var nfaRate = 0;
        var percent = parseFloat(flowData.percent)

        // generate html content header
        content += "<h3>" + "Required Flow Rates" + "</h3>" + "<hr>";

        // Lets do Iowa Flow Rate First
        iowaRate = flowData.length * flowData.width * flowData.height
        iowaRate = iowaRate / 100;
        content += "<h3>" + "<strong>" + "Iowa : " + "</strong>" + parseFloat(iowaRate).toFixed(1) + " gpm" + "</h3>";

        // conditional content based on involved percentage
        if(parseFloat(percent) <= 0.50)
        {
            nfaRate = flowData.length * flowData.width;
            nfaRate = nfaRate / 3;
            nfaRate = nfaRate * flowData.percent
            content += "<h3>" + "<strong>" + "NFA   : " + "</strong>" + parseFloat(nfaRate).toFixed(1) + " gpm" + "</h3>" + "<br />";
        }
        else
        {
            nfaRate = "Not Valid for Percent Involved > 50%"
            content += "<h3>" + "<strong>" + "NFA   : " + "</strong>" + nfaRate + "</h3>" + "<br />";
        }

        $("#flowContent").html(content);
        iowaRate = 0;
        nfaRate = 0;
    };

    // Fire Flow Form Validation -----------------------------------------------
    function fireFlowValidate()
    {
        // Structure Length
        var formIsValid = true;
        var inputLength = $("#inputLength");
        
        // if length number > 0
        if (parseFloat(inputLength.val()) > 0)
        {
            inputLength.parent().removeClass("has-error");
            inputLength.parent().addClass("has-success");
            inputLength.next().hide();  // hide error span
            flowData.length = inputLength.val();
        }
        else
        {
            formIsValid = false;
            inputLength.parent().addClass("has-error");
            inputLength.parent().removeClass("has-success");
            inputLength.next().show();  // show error span
        }

        // Structure Width
        var formIsValid = true;
        var inputWidth = $("#inputWidth");
        
        // if width is > 0
        if (parseFloat(inputWidth.val()) > 0)
        {
            inputWidth.parent().removeClass("has-error");
            inputWidth.parent().addClass("has-success");
            inputWidth.next().hide();  // hide error span
            flowData.width = inputWidth.val();
        }
        else
        {
            formIsValid = false;
            inputWidth.parent().addClass("has-error");
            inputWidth.parent().removeClass("has-success");
            inputWidth.next().show();  // show error span
        }

        // Structure Height
        var formIsValid = true;
        var inputHeight = $("#inputHeight");
        
        // if width is > 0
        if (parseFloat(inputHeight.val()) > 0)
        {
            inputHeight.parent().removeClass("has-error");
            inputHeight.parent().addClass("has-success");
            inputHeight.next().hide();  // hide error span
            flowData.height = inputHeight.val();
        }
        else
        {
            formIsValid = false;
            inputHeight.parent().addClass("has-error");
            inputHeight.parent().removeClass("has-success");
            inputHeight.next().show();  // show error span
        }

        // get the percent involved value directly from the list-box selection
        var inputPercentInvolved = $("#inputPercentInvolved")
        flowData.percent = inputPercentInvolved.val();        

        // if we got this far, form is valid
        return formIsValid;

    };

    //==========================================================================
    // Water Supply Functions
    //==========================================================================    

    // Display Water Supply Data -----------------------------------------------
    function waterSupplyDisplayData()
    {
         // get session data
        var retrievedObject = sessionStorage.getItem('calcWaterData');
        waterData = JSON.parse(retrievedObject);

        // local function variables
        var content = "";
        var tenderCapacity = 0;
        var engineCapacity = 0;
        var pumpRate = 0;
        var timeUntilEmpty = 0;

        // generate html content header
        content += "<h3>" + "Water Capacity in Time Minutes" + "</h3>" + "<hr>";

        // do some calculations
        tenderCapacity = parseFloat(waterData.tender).toFixed(1);
        engineCapacity = parseFloat(waterData.engine).toFixed(1);
        pumpRate = parseFloat(waterData.pump).toFixed(1);

        timeUntilEmpty = +tenderCapacity + +engineCapacity;
        timeUntilEmpty = timeUntilEmpty / pumpRate;
        
        // display content
        content += "<h4>" + "<strong>" + "Time Remaining : " + "</strong>" + parseFloat(timeUntilEmpty).toFixed(1) + " minutes" + "</h4>";

        if(timeUntilEmpty < 20.0)
        {
            content += "<h4>" + "<strong>" + "WARNING: Water Resupply is Critial !!" + "</h4>";
        }

        $("#waterContent").html(content);
        timeUntilEmpty = 0;

    };
    
    // Water Supply Form Validation --------------------------------------------
    function waterSupplyValidate()
    {
        // Tender Water Capacity
        var formIsValid = true;
        var inputTenderCapacity = $("#inputTenderCapacity");
        
        // if length number > 0
        if (parseFloat(inputTenderCapacity.val()) > 0)
        {
            inputTenderCapacity.parent().removeClass("has-error");
            inputTenderCapacity.parent().addClass("has-success");
            inputTenderCapacity.next().hide();  // hide error span
            waterData.tender = inputTenderCapacity.val();
        }
        else
        {
            formIsValid = false;
            inputTenderCapacity.parent().addClass("has-error");
            inputTenderCapacity.parent().removeClass("has-success");
            inputTenderCapacity.next().show();  // show error span
        }

        // Engine Capacity
        var formIsValid = true;
        var inputEngineCapacity = $("#inputEngineCapacity");
        
        // if length number > 0
        if (parseFloat(inputEngineCapacity.val()) > 0)
        {
            inputEngineCapacity.parent().removeClass("has-error");
            inputEngineCapacity.parent().addClass("has-success");
            inputEngineCapacity.next().hide();  // hide error span
            waterData.engine = inputEngineCapacity.val();
        }
        else
        {
            formIsValid = false;
            inputEngineCapacity.parent().addClass("has-error");
            inputEngineCapacity.parent().removeClass("has-success");
            inputEngineCapacity.next().show();  // show error span
        }        

        // Engine Pump Rate
        var formIsValid = true;
        var inputPumpRate = $("#inputPumpRate");
        
        // if length number > 0
        if (parseFloat(inputPumpRate.val()) > 0)
        {
            inputPumpRate.parent().removeClass("has-error");
            inputPumpRate.parent().addClass("has-success");
            inputPumpRate.next().hide();  // hide error span
            waterData.pump = inputPumpRate.val();
        }
        else
        {
            formIsValid = false;
            inputPumpRate.parent().addClass("has-error");
            inputPumpRate.parent().removeClass("has-success");
            inputPumpRate.next().show();  // show error span
        }

        // if we got this far, form is valid
        return formIsValid;

    };

});