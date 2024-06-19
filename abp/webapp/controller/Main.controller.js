sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("abp.controller.Main", {
        onInit: function () {
            var oModel = new sap.ui.model.json.JSONModel({
                selectedSecurity: false,
                selectedEnvironment: false,
                selectedHealthy: false,
                selectedMarine: false,
                what3words: "",
                mapVisible: false
            });
            this.getView().setModel(oModel);
        
        },
        
        onSecuritySelect: function (oEvent) {
            var bSelected = oEvent.getParameter("selected");
            var oModel = this.getView().getModel();
        
            // Update model property for Security checkbox
            oModel.setProperty("/selectedSecurity", bSelected);
        
            // Enable/disable other checkboxes based on Security checkbox state
            var bEnableOthers = !bSelected;
            this.byId("Environment").setEnabled(bEnableOthers);
            this.byId("Healthy").setEnabled(bEnableOthers);
            this.byId("Marine").setEnabled(bEnableOthers);
        },
        
        onClassificationSelect: function (oEvent) {
            var bSelected = oEvent.getParameter("selected");
            var sSourceId = oEvent.getSource().getId();
            var oModel = this.getView().getModel();
        
            // Update model property for the clicked classification checkbox
            switch (sSourceId) {
                case this.createId("Environment"):
                    oModel.setProperty("/selectedEnvironment", bSelected);
                    break;
                case this.createId("Healthy"):
                    oModel.setProperty("/selectedHealthy", bSelected);
                    break;
                case this.createId("Marine"):
                    oModel.setProperty("/selectedMarine", bSelected);
                    break;
                default:
                    break;
            }
        
            // Check if all checkboxes are unchecked
            var bAllUnchecked = !oModel.getProperty("/selectedEnvironment") &&
                                !oModel.getProperty("/selectedHealthy") &&
                                !oModel.getProperty("/selectedMarine");
            
            // Enable Security checkbox only if all other checkboxes are unchecked
            this.byId("Security").setEnabled(bAllUnchecked);
        },
    
        onWhat3WordsLinkPress: function() {
            var sWhat3Words = this.getView().getModel().getProperty("/what3words");
            var sIframeContent = '<iframe src="https://w3w.co/toddler.geologist.animated' + sWhat3Words + '?maptype=satellite&zoom=18" width="100%" height="400px" style="border:none;"></iframe>';
            this.getView().byId("w3wMap").setContent(sIframeContent);
        
            // Update the model to show the hide button
            this.getView().getModel().setProperty("/mapVisible", true);
        },
        
        onHideMapPress: function() {
            this.getView().byId("w3wMap").setContent(""); 
        
            // Update the model to hide the hide button
            this.getView().getModel().setProperty("/mapVisible", false);
        },
        onSubmit: function() {
            // Build your payload data to send to the endpoint
            var formData = {
                // Populate with your form data properties
                Name: this.getView().getModel().getProperty("/Name"),
                Telephone: this.getView().getModel().getProperty("/Telephone"),
                Email: this.getView().getModel().getProperty("/Email"),
                // Add other form fields as needed
            };
        
            // Example of AJAX call to send data to the endpoint
            jQuery.ajax({
                type: "POST",
                contentType: "application/json",
                url: "https://l20255-iflmap.hcisbp.eu1.hana.ondemand.com/cxf/INC_CREATE1",
                data: JSON.stringify(formData),
                dataType: "json",
                success: function(data, textStatus, jqXHR) {
                    // Handle success response
                    console.log("Submission successful:", data);
                    // Optionally, navigate to a success page or perform other actions
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // Handle error response
                    console.error("Error submitting data:", textStatus, errorThrown);
                    // Optionally, show an error message to the user
                }
            });
        }
        
    });
});

