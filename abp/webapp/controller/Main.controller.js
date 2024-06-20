sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("abp.controller.Main", {
        onInit: function () {
            // Initialize properties for various selections and states
            var oModel = new sap.ui.model.json.JSONModel({
                selectedSecurity: false,
                selectedEnvironment: false,
                selectedHealthy: false,
                selectedMarine: false,
                what3words: "",
                mapVisible: false,
                selectedFiles: [],
                incidentType: "Incident",

            });

            // Set the model to the view
            this.getView().setModel(oModel);

            var oModel = this.getView().getModel();
            oModel.setProperty("/isObservation", false);
        },
        onSelectionChange: function (oEvent) {
            var selectedKey = oEvent.getParameter("selectedItem").getKey();
            var oModel = this.getView().getModel();
            oModel.setProperty("/incidentType", selectedKey);
        
            if (selectedKey === "observation") {
                oModel.setProperty("/isObservation", true);
            } else {
                oModel.setProperty("/isObservation", false);
            }
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

        onWhat3WordsLinkPress: function () {
            var sWhat3Words = this.getView().getModel().getProperty("/what3words");
            var sIframeContent = '<iframe src="https://w3w.co/toddler.geologist.animated' + sWhat3Words + '?maptype=satellite&zoom=18" width="100%" height="400px" style="border:none;"></iframe>';
            this.getView().byId("w3wMap").setContent(sIframeContent);

            // Update the model to show the hide button
            this.getView().getModel().setProperty("/mapVisible", true);
        },

        onHideMapPress: function () {
            this.getView().byId("w3wMap").setContent("");

            // Update the model to hide the hide button
            this.getView().getModel().setProperty("/mapVisible", false);
        },




        // onFileUploaderChange: function (oEvent) {
        //    var aFiles = oEvent.getParameter("files");
        //      var oModel = this.getView().getModel(); 

        //    // Get the current files list from the model
        //     var aCurrentFiles = oModel.getProperty("/files") || [];

        //     // Prepare new files array to append
        //     var aNewFiles = [];
        //     for (var i = 0; i < aFiles.length; i++) {
        //         aNewFiles.push({
        //             fileName: aFiles[i].name
        //          });
        //     }

        //     // Concatenate the current files with the new files
        //     var aAllFiles = aCurrentFiles.concat(aNewFiles);

        //     // Update the model with the combined files list
        //     oModel.setProperty("/files", aAllFiles);

        //     // Clear the FileUploader field if needed (optional)
        //     var oFileUploader = this.byId("fileUploader");
        //     oFileUploader.clear(); 
        // },

        onFileUploaderChange: function (oEvent) {
            // Get the files from the event
            var aFiles = oEvent.getParameter("files");
            var oModel = this.getView().getModel();

            // Get the current files list from the model
            var aCurrentFiles = oModel.getProperty("/files") || [];

            // Prepare new files array to append
            var aNewFiles = [];
            for (var i = 0; i < aFiles.length; i++) {
                var oFile = aFiles[i];

                // Check for valid file type (jpg or jpeg)
                if (this._isValidFileType(oFile)) {
                    // Check if the file is already in the list
                    var bFileExists = aCurrentFiles.some(function (oCurrentFile) {
                        return oCurrentFile.fileName === oFile.name;
                    });

                    if (!bFileExists) {
                        aNewFiles.push({
                            fileName: oFile.name
                        });
                    } else {
                        // Optional: Display a message if the file already exists
                        sap.m.MessageToast.show("File '" + oFile.name + "' is already added.");
                    }
                } else {
                    // Display a message if the file type is not valid
                    sap.m.MessageToast.show("Only JPG/JPEG files are allowed.");
                }
            }

            // Concatenate the current files with the new files
            var aAllFiles = aCurrentFiles.concat(aNewFiles);

            // Update the model with the combined files list
            oModel.setProperty("/files", aAllFiles);

            // Clear the FileUploader field if needed (optional)
            var oFileUploader = this.byId("fileUploader");
            oFileUploader.clear();
        },

        _isValidFileType: function (oFile) {
            // Check if the file type is either jpeg or jpg
            var sFileType = oFile.type.toLowerCase();
            return sFileType === "image/jpeg" || sFileType === "image/jpg";
        },

        onDeleteItem: function (oEvent) {
            // Get the list item context and model
            var oButton = oEvent.getSource();
            var oItem = oButton.getParent().getParent();
            var oContext = oItem.getBindingContext();
            var oModel = this.getView().getModel();

            // Get the path of the selected item
            var sPath = oContext.getPath();
            var iIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));

            // Get the files array from the model
            var aFiles = oModel.getProperty("/files");

            // Remove the selected file from the array
            if (iIndex > -1) {
                aFiles.splice(iIndex, 1);
            }

            // Update the model with the updated files array
            oModel.setProperty("/files", aFiles);
        },


        onUpload: function () {
            var oModel = this.getView().getModel();
            var aFiles = oModel.getProperty("/files");

            // Implement upload logic here (e.g., send files to server)

            // Optionally, clear files from model after upload
            oModel.setProperty("/files", []);
        },
        onActivate: function () {
            var oModel = this.getView().getModel();
            oModel.setProperty("/files", []); // Initialize or clear files array
        },

        complianceFormatter: function (selectedSecurity, selectedEnvironment, selectedHealthy, selectedMarine) {
            var compliance = [];
            if (selectedSecurity) {
                compliance.push("Security");
            }
            if (selectedEnvironment) {
                compliance.push("Environment");
            }
            if (selectedHealthy) {
                compliance.push("Healthy & Safety");
            }
            if (selectedMarine) {
                compliance.push("Marine");
            }
            return compliance.join(", ");
        }


    });
});

