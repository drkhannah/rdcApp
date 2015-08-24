#if(__i386__ ||__x86_64__) 

#else

#import "MiSnapPlugin.h"

@implementation MiSnapPlugin



- (void) cordovaCallMiSnap:(CDVInvokedUrlCommand *)command
{
    self.cmd=command;
    
    //MiSnap Invocation with default parameters for check front
    NSDictionary *videoParameters = [MiSnapViewController defaultParametersForCheckFront];
    MiSnapViewController *controller = [[MiSnapViewController alloc] init];
    controller.delegate = self;
    controller.navigationController.navigationBar.hidden=YES;
    [controller setupMiSnapWithParams:videoParameters];
    

    NSLog(@"COMMAND:%@",command.callbackId);
    
    [self.viewController presentViewController:controller animated:NO completion:^{
        
    }];
}

#pragma mark -
#pragma mark MiSnap Delegate methods

//MiSnap Image returning delegate

- (void)miSnapFinishedReturningEncodedImage:(NSString *)encodedImage originalImage:(UIImage *)image andResults:(NSDictionary *)results {
    
    //Convert original image(UIImage) to base64 string
    NSData * data = UIImageJPEGRepresentation(image,0.0);
    NSString* originalImage= [self base64Encoding:data];
    
    NSMutableDictionary* resultDictionary=[[NSMutableDictionary alloc]init];
    [resultDictionary setObject:originalImage forKey:@"OriginalImage"];//Optional
    [resultDictionary setObject:encodedImage forKey:@"EncodedImage"];
    [resultDictionary setObject:results forKey:@"ResultDictionary"];
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:resultDictionary];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.cmd.callbackId];
    
    /*Sent the image to the web layer from native layer
     ....
     ....
     */
    
}

//MiSnap Cancel delegate

- (void)miSnapCancelledWithResults:(NSDictionary *)results {
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT messageAsString:@"Cancelled"];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.cmd.callbackId];
}

//Base64 encoding
static const char encodingTable[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

- (NSString*)base64Encoding:(NSData*)input
{
    if (input.length == 0)
        return @"";
    
    char* characters = (char*)malloc(((input.length + 2) / 3) * 4);
    if (characters == NULL)
        return nil;
    
    NSUInteger length = 0;
    
    NSUInteger i = 0;
    while (i < input.length)
    {
        char buffer[3] = {0,0,0};
        short bufferLength = 0;
        while ((bufferLength < 3) && (i < input.length))
        {
            buffer[bufferLength++] = ((char*)input.bytes)[i++];
        }
        
        //  Encode the bytes in the buffer to four characters, including padding "=" characters if necessary.
        characters[length++] = encodingTable[(buffer[0] & 0xFC) >> 2];
        characters[length++] = encodingTable[((buffer[0] & 0x03) << 4) | ((buffer[1] & 0xF0) >> 4)];
        
        if (bufferLength > 1)
            characters[length++] = encodingTable[((buffer[1] & 0x0F) << 2) | ((buffer[2] & 0xC0) >> 6)];
        else
            characters[length++] = '=';
        
        if (bufferLength > 2)
            characters[length++] = encodingTable[buffer[2] & 0x3F];
        else
            characters[length++] = '=';
    }
    
    return [[NSString alloc] initWithBytesNoCopy:characters length:length encoding:NSASCIIStringEncoding freeWhenDone:YES];
}


@end

#endif 
