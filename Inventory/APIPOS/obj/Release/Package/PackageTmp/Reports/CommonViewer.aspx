<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CommonViewer.aspx.cs" Inherits="APIPOS.Reports.CommonViewer" %>
<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=12.0.0.0, Culture=neutral, PublicKeyToken=89845DCD8080CC91" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>


<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <asp:Label ID="lblMsg" runat="server" Font-Bold="True" Font-Italic="True"
        Font-Size="X-Large" ForeColor="#CC3300"></asp:Label>
    <form id="form1" runat="server" style="margin-left:100px;">
        <rsweb:ReportViewer ID="ReportViewer1" runat="server" SizeToReportContent="true" Width="100%"></rsweb:ReportViewer>
        <asp:ScriptManager ID="ScriptManager1" runat="server" >            
        </asp:ScriptManager>
    </form>
</body>
</html>
