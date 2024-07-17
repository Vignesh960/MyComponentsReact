const config = {
  // 172.17.12.151:4062
  Login: {
    LoginURL: "http://172.17.12.151:4062/api/security/Login",
  },
  Logout: {
    url: "http://172.17.12.151:4062/api/security/logout",
  },
  RefreshToken: {
    url: "http://172.17.12.151:4062/api/security/refreshToken",
  },
  insertdata: {
    url: "http://172.17.12.151:4062/api/security/insertdata",
  },
  Roles: {
    GetUserRolesDataUrl: "http://172.17.12.151:4062/index/api/getRoleBasedModules",
    UpdateUserRolesDataUrl:
      "http://172.17.12.151:4062/index/api/updateRoleBasedModules",
  },
  jobsTemplate: {
    url: "/JS-Web/uploads/template/jobs_upload_template.xlsx",
  },
  
  checklistTemplate: {
    url: "/acnc_new/uploads/template/checklist_upload_template.xlsx",
  },
  bulkuserTemplate: {
    url: "/acnc_new/uploads/template/users_upload.xlsx",
  },
  bulkdefectsTemplate: {
    url: "/acnc_new/uploads/template/bulkdefects_upload_template.xlsx",
  },
  ProcessQuery: {
    url: "http://172.17.12.151:4062/api/data/ProcessQuery",
  },
  UpLoadFile: {
    url: "http://172.17.12.151:4062/api/uploadjobs/UploadFile",
  },
  UpLoadAdditionalRepFields: {
    url: "http://172.17.12.151:4062/Xcel/WorkTrackerNxt/NodeServices/MIS/api/uploadjobs/UploadJobAdditionalFlds",
  },
  deleteFile: {
    url: "http://172.17.12.151:4062/Xcel/WorkTrackerNxt/NodeServices/MIS/api/uploadjobs/deleteFile",
  },
  UpLoadJobs: {
    url: "http://172.17.12.151:4062/api/uploadjobs/UploadJobsToDB",
  },
  UpLoadJobsforbulkusers: {
    url: "http://172.17.12.151:4062/api/uploadjobs/UploadJobsforBulkUsers",
  },
  UpLoadJobsbulkdefects: {
    url: "http://172.17.12.151:4062/api/uploadjobs/UploadJobsDefectsToDB",
  },
  GetAssociates: {
    url: "http://172.17.12.151:4062/api/data/Associates",
  },
  UpdateJobs: {
    url: "http://172.17.12.151:4062/api/data/UpdateData",
  },
  DeleteJobs: {
    url: "http://172.17.12.151:4062/api/data/DeleteData",
  },
  UpdateTimesheet: {
    url: "http://172.17.12.151:4062/api/data/UpdateTimesheet",
  },
  InsertData: {
    url: "http://172.17.12.151:4062/api/data/InsertData",
  },
  GetAssociatesForQCStatus: {
    url: "http://172.17.12.151:4062/api/data/QCAssociates",
  },
  ProcessQueryWitVals: {
    url: "http://172.17.12.151:4062/api/data/ProcessQueryWithVals",
  },
  ProcessQueryWithEmailVals: {
    url: "http://172.17.12.151:4062/api/data/ProcessQueryWithEmailVals",
  },
  UpdateDatawithfunction: {
    url: "http://172.17.12.151:4062/api/data/UpdateDatawithfunction",
  },
  UpdateDatawithfunction1: {
    url: "http://172.17.12.151:4062/api/data/UpdateDatawithfunction1",
  },
  UploadImageFile: {
    url: "http://172.17.12.151:4062/api/uploadjobs/Uploadimage",
  },
  renamephoto: {
    url: "http://172.17.12.151:4062/api/uploadjobs/renameimage",
  },
  UpdateJsondata: {
    url: "http://172.17.12.151:4062/api/data/UpdateJsonData",
  },
  UploadJobsFromJSON: {
    url: "http://172.17.12.151:4062/api/uploadjobs/UploadJobsFromJSON",
  },
  ProcessDataTableQuery: {
    url: "http://172.17.12.151:4062/api/data/ProcessDataTableQuery",
  },
  ProcessQueryCursor: {
    url: "http://172.17.12.151:4062/api/data/ProcessQueryCursor",
  },
  // ProcessQueryCursor: {
  //   url: "http://172.17.12.151:4062/api/data/ProcessQueryCursor",
  // },
  ProcessQueryCursorHandleNaN: {
    url: "http://172.17.12.151:4062/api/data/ProcessQueryCursorHandleNaN",
  },
  ProcessQueryCursorprodreport: {
    url: "http://172.17.12.151:4062/api/data/ProcessQueryCursorprodreport",
  },
  ProcessQueryCursor_Dashboard: {
    url: "http://172.17.12.151:4062/api/data/ProcessQueryCursor_Dashboard",
  },
  UploadAttachments: {
    url: "http://172.17.12.151:4062/api/uploadjobs/UploadAttachments",
  },
  DownloadData: {
    url: "http://172.17.12.151:4062/api/data/DownloadData",
  },
  UpLoadInvoiceJobs: {
    url: "http://172.17.12.151:4062/api/uploadjobs/UploadInvoice",
  },
  TableColumns: {
      UserDetails:
      "userid,fullname,mobile,emailid",
      Userconfig:
      "customer,project_name,username,bu,bu_vertical,bu_sl",
      monthlyreport:
      "customer,project_name,invoiced_date,recognised_date,recognised_amount,invoiced_amount,advance_amount,advance_date,bu,bu_sl,bu_vertical",
      viewmilestone1:
      "project_id,project_name,location,project_shortname,project_code,project_budget,mlstn_id,date,milestone,mlstn_shortname,milestone_value,status,mlstn_enddate,mlstn_startdate,project_startdate,project_enddate,available_budget,category,monthly_value,mlstn_parentid,parent_milestone,parent_project",
     
      viewmilestone:
      "project_id,project_name,location,project_shortname,project_code,invoiced,remaining,project_budget,mlstn_id,date,milestone,mlstn_shortname,milestone_value,status,mlstn_enddate,mlstn_startdate,project_startdate,project_enddate,available_budget,category,monthly_value,mlstn_parentid,parent_milestone,parent_project",
      viewproject:
      "project_id,project_name,project_code,category,budget,parent_project,startdate,enddate,total_milestones,bu,bu_vertical,bu_sl,customer,per_day_hours,invoiced,calculated_budget,dh,pm,sales_document,wbs_element",
      Empconfig:
      "emp_id,emp_name,email_id,cost_rate,mobile_num",
      ProjectTagDetails:
      "projectID,emp_id,start_date,end_date",
    },
  DisplayColumns: {
    UserDetails:
    "userid,fullname,mobile,emailid,role,manager,teamleader,projects,location",
    viewmilestone:
    "project_name,category,milestone,milestone_value,status,invoiced,remaining",
    viewmilestone1:
    "project_name,category,milestone,monthly_value,status,date",
    viewproject:
    "project_id,project_name,category,budget,parent_project,startdate,enddate,total_milestones,bu,bu_vertical,bu_sl,customer,dh,pm,sales_document,wbs_element"

    },
  GethrsDatabasedonjob: {
    url: "http://172.17.12.151:4062/api/data/Gethrs",
  },
  AddRepFieldsTemplte: "/Exelon_WFM/uploads/template/",
  UploadBlkDefectsforJobs: {
    url: "http://172.17.12.151:4062/api/uploadjobs/UploadBlkDefectsforJobs",
  },
  defectsuploadTemplate: {
    url: "/Exelon_WFM/uploads/template/BulkDefectUpload.xlsx",
  },
  ProductivityPercMax: 1000,
  DataEntryColumnOrder:
    "Asbuilt (Y/N),Lat,Long,ERP ID,Location/Parent Feature,Location/Parent Feature ID,Feature,Feature ID (GESW),Input Status,Tool Output Result,Final Status",
  UploadDataEntryoutputData: {
    url: "http://172.17.12.151:4062/api/uploadjobs/UploadDataEntryData",
  },
  UploadCSVFile: {
    url: "http://172.17.12.151:4062/api/uploadjobs/UploadCSVFile",
  },
  DataEntryDefaultVals: {
    Pole: "Ownership:Company Owned,Usage Type:Unknown,Treatment Type:UNK - Unknown,Framing Type:Unknown",
    "Street Light":
      "Lens Type:Unknown,Outlet?:Unknown,Ownership:Company Owned,Photocell Type:Unknown,Shielding?:Unknown,Time Control?:Unknown",
    "Area Light":
      "Lens Type:Unknown,Outlet?:Unknown,Ownership,Company Owned:Photocell Type:Unknown,Shielding?:Unknown,Time Control?:Unknown,Type:Area Night watch",
    "OH Secondary": "Ownership:Company Owned",
    "UG Secondary": "Ownership:Company Owned",
  },
  MandataryFeatures: {
    Lat: "Primary Splice",
    Long: "Primary Splice",
    ParentFeatureId:
      "Area Light,Street light,Secondary Wire,Secondary Cable,OH TRANSFORMER BANK,OH Transformer Bank Unit,Service wire,Service cable,UG Transformer,UG Transformer Bank Unit,Primary Splice,Riser,Anchor guy,Cable Failure Indicator,OH Fuse,OH Fuse Unit,OH Switch,OH Switch Unit,Primary wire,Primary Cable,Fault Indicator,Capacitor Rack,Primary Open Point,Primary Meter,Recloser Bank,Recloser Bank Unit,Regulator Bank,Regulator Bank Unit,Sectionalizer Bank,Sectionalizer Bank Unit,Step Transformer Bank,Step Transformer Bank Unit,UG Fuse,UG Fuse Unit,UG Switch",
    ParentFeatureName:
      "Area Light,Street light,Secondary Wire,Secondary Cable,OH TRANSFORMER BANK,OH Transformer Bank Unit,Service wire,Service cable,UG Transformer,UG Transformer Bank Unit,Primary Splice,Riser,Anchor guy,Cable Failure Indicator,OH Fuse,OH Fuse Unit,OH Switch,OH Switch Unit,Primary wire,Primary Cable,Fault Indicator,Capacitor Rack,Primary Open Point,Primary Meter,Recloser Bank,Recloser Bank Unit,Regulator Bank,Regulator Bank Unit,Sectionalizer Bank,Sectionalizer Bank Unit,Step Transformer Bank,Step Transformer Bank Unit,UG Fuse,UG Fuse Unit,UG Switch",
  },
  dataEntryuploadtemplate: {
    url: "/Exelon_WFM/uploads/template/CSV_DataEntry.csv",
  },
  Email: {
    MailDetailsURL: "http://172.17.12.151:4062/api/mails/MailDetails",
  },
  convertAcceptance: 100,
  convertCorections: 95,
  qmqaAcceptance: 100,
  dsmAcceptance: 100,
  geswAcceptance: 100,
  geswCorections: 98,
  timesheetdata: 9.0,
  dplAcceptance: 100,
  dplCorrections: 98,
  "AC&C conversionQC1": 100,
  "AC&C conversionQC2": 95,
  "Post ProductionDSM Checks fixing1": 100,
  "Post ProductionDSM Checks fixing2": 100,
  "Post ProductionGESW Visual DAT1": 100,
  "Post ProductionGESW Visual DAT2": 98,
  "Post ProductionQM/QA Routines fixing1": 100,
  "Post ProductionQM/QA Routines fixing2": 100,
  "DPL Service CleanupQC1": 100,
  "DPL Service CleanupQC2": 98,
  e3time: 9,
  getprocess: {
    url: "http://172.17.12.151:4062/api/process",
  },
  getprocessdata: {
    url: "http://172.17.12.151:4062/api/process/data",
  },
  gettlprocess: {
    url: "http://172.17.12.151:4062/api/teamlead",
  },
  gettldata: {
    url: "http://172.17.12.151:4062/api/teamlead/data",
  },
  getprojectwiseprocess: {
    url: "http://172.17.12.151:4062/api/process/projectwiseprocess",
  },
  getindividual: {
    url: "http://172.17.12.151:4062/api/process/getindividual",
  },
  gettlindividual: {
    url: "http://172.17.12.151:4062/api/teamlead/getindividual",
  },
  getdashboard: {
    url: "http://172.17.12.151:4062/api/dashboard",
  },
  getDashboardProgress: {
    url: "http://172.17.12.151:4062/api/dashboard/progress",
  },
  UpdateDatawithfunction12: {
    url: "http://172.17.12.151:4062/api/data/UpdateDatawithfunction12",
  },
  UpdateBulktimesheet1: {
    url: "http://172.17.12.151:4062/api/data/UpdateBulktimesheet1",
  },
  QcsummaryReport: {
    url: "http://172.16.5.121/qcsummaryreport/Qcreport/Post",
  },
  getgeneraltimesheetentry: {
    url: "http://172.17.12.151:4062/api/timesheet",
  },
  getuserlog: {
    url: "http://172.17.12.151:4062/api/getuserlog",
  },
  getuserlogdata: {
    url: "http://172.17.12.151:4062/api/getuserlog/data",
  },
  getuserlogsummary: {
    url: "http://172.17.12.151:4062/api/getuserlog/summary",
  },
  ProcessQueryEstimateHrsVsActualHrs: {
    url: "http://172.17.12.151:4062/api/data/ProcessQueryEstimateHrsVsActualHrs",
  },
  UploadUserFile: {
    url: "http://172.17.12.151:4062/api/uploadusers/uploaduserfile",
  },
  UpLoadChecklistData: {
    url: "http://172.17.12.151:4062/api/uploadjobs/UploadChecklistToDB",
  },
  getDensityProgress: {
    url: "http://172.17.12.151:4062/api/dashboard/densityprogress",
  },
};

export default config;
