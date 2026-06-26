"use strict";

const fs = require("fs");
const path = require("path");

function readJsonIfExists(file) {
  if (!fs.existsSync(file)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function loadWorkspaceProfiles(workbenchRoot) {
  const root = path.resolve(workbenchRoot);
  const basePath = path.join(root, "config", "workspace-profiles.json");
  const localPath = path.join(root, "config", "workspace-profiles.local.json");
  const configs = [
    { kind: "base", path: basePath, data: readJsonIfExists(basePath) },
    { kind: "local", path: localPath, data: readJsonIfExists(localPath) },
  ].filter((item) => item.data);

  const profiles = new Map();
  let activeProfile = null;
  for (const config of configs) {
    if (config.data.activeProfile) {
      activeProfile = config.data.activeProfile;
    }
    for (const profile of config.data.profiles || []) {
      profiles.set(profile.name, { ...profile, profileSource: config.kind, profileSourcePath: config.path });
    }
  }

  return {
    activeProfile,
    profiles: [...profiles.values()],
    get(name) {
      return profiles.get(name);
    },
  };
}

function resolveProfile(workbenchRoot, requestedName) {
  const registry = loadWorkspaceProfiles(workbenchRoot);
  const name = requestedName || registry.activeProfile;
  if (!name) {
    return null;
  }
  const profile = registry.get(name);
  if (!profile) {
    throw new Error(`Unknown workspace profile: ${name}`);
  }
  return profile;
}

function resolveSourcePvf(workbenchRoot, requestedProfile, explicitPvf) {
  if (explicitPvf) {
    return {
      sourcePvf: path.resolve(explicitPvf),
      profile: requestedProfile ? resolveProfile(workbenchRoot, requestedProfile) : null,
      source: explicitPvf ? "--pvf" : "profile",
    };
  }
  const profile = resolveProfile(workbenchRoot, requestedProfile);
  if (!profile) {
    throw new Error("Provide --pvf or configure/select a workspace profile.");
  }
  return {
    sourcePvf: path.resolve(profile.sourcePvf),
    profile,
    source: "profile",
  };
}

module.exports = {
  loadWorkspaceProfiles,
  resolveProfile,
  resolveSourcePvf,
};
