import Middleware from "../middlewares/auth_middleware";
import Validation from "../middlewares/joi_middleware";
import orgServices from "../controllers/organization_controller";

const OrgRoute = (app) => {
  app.post(
    "/add/org",
    Validation.JoiMiddleware,
    Middleware.authValidation,
    orgServices.addOrganization
  );
  app.get("/user/orglist", orgServices.organizationAllData);
  app.put(
    "/user/orgupdate/:id",
    Validation.JoiMiddleware,
    Middleware.authValidation,
    orgServices.organizationUpdate
  );
};

export default OrgRoute;
