//
//  XSYUpgradeManager.m
//  ingageplatform
//
//  Created by purple on 16/6/13.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "XSYUpgrade.h"

@implementation XSYUpgrade
RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(currentVersion,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  NSString * version = [XSYJSVersion getCurrentVersion];
  if (version) {
    resolve(version);
  }else{
    reject(@"no",nil,nil);
  }
}

RCT_REMAP_METHOD(setVersion,
                 newVersion:(NSString *) version
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  [XSYJSVersion setVersion:version];
  resolve(@"1");
}


RCT_REMAP_METHOD(baseVersion,
                 resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject){
  NSString * version = [XSYJSVersion getBaseVersion];
  if (version) {
    resolve(version);
  }else{
    reject(@"no",nil,nil);
  }
}

RCT_REMAP_METHOD(versionDesc,
                 source:(NSString *) source
                 target:(NSString *) target
                 resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject){
  BOOL  version = [XSYJSVersion versionDesc:source target:target];
  resolve(version ? @"1" :@"0");
}


RCT_REMAP_METHOD(currentVersionPath,
                 currentVersion:(NSString *) currentVersion
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  NSString * path = [XSYJSVersion getVersionPath:currentVersion];
  if (path) {
    resolve(path);
  }else{
    reject(@"no",nil,nil);
  }
}
//
//RCT_REMAP_METHOD(currentVersionPathOrCreate,
//                 version:(NSString *) currentVersion
//                 resolver:(RCTPromiseResolveBlock)resolve
//                 rejecter:(RCTPromiseRejectBlock)reject){
//  NSString * path = [XSYJSVersion getVersionPathOrCreate:currentVersion];
//  if (path) {
//    resolve(path);
//  }else{
//    reject(@"no",nil,nil);
//  }
//}

RCT_REMAP_METHOD(combine,
                 patchPath:(NSString *) patchPath
                 newVersion:newVersion
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
   XSYPatchCombine * patch = [[XSYPatchCombine alloc]init];
  [patch combineIndexBundle:patchPath newVersion:newVersion completionHandler:^(BOOL success){
      if (success) {
        [XSYJSVersion setVersion:newVersion];
        resolve(@YES);
      }else{
        reject(@"no",@"combine err",nil);
      }
      
    }];
  }


@end
