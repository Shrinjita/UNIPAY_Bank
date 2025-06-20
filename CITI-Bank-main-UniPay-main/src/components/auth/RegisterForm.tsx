import React, { useState, useEffect } from 'react'; // Import useEffect
import Tesseract from 'tesseract.js';
import imageCompression from 'browser-image-compression';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
    sendEmailVerification,
    reload,
    signOut, // Keep signOut for specific cases, but not immediately after register
    onAuthStateChanged // Import onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../../firebase/firebaseConfig';

interface KYCUploadState {
    file: File | null;
    processing: boolean;
    progress: number;
    ocrText: string | null;
    isCompressing: boolean;
}

const RegisterForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isEmailVerificationPending, setIsEmailVerificationPending] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false); // This will indicate the *current* user's verified status
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null); // Store email for pending message

    const [kycUpload, setKycUpload] = useState<KYCUploadState>({
        file: null,
        processing: false,
        progress: 0,
        ocrText: null,
        isCompressing: false,
    });

    const navigate = useNavigate();
    const { toast } = useToast();

    // Use useEffect to listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // If user exists and email is not verified, but verification was pending
                if (!user.emailVerified && isEmailVerificationPending) {
                    setCurrentUserEmail(user.email);
                    // Optionally, try to reload here immediately if the user returns
                    try {
                        await reload(user);
                        if (user.emailVerified) {
                            setIsEmailVerified(true);
                            setIsEmailVerificationPending(false);
                            // This scenario means the user verified outside the app or on another tab
                            await saveUserData({ ...user, emailVerified: true }); 
                            toast({
                                title: "Email Verified!",
                                description: "Your email has been verified. Redirecting to login...",
                                variant: "default",
                                duration: 3000
                            });
                            // Sign out after successful verification and data save, then redirect
                            await signOut(auth);
                            navigate('/login');
                        } else {
                            // Still not verified, keep pending state
                            setIsEmailVerificationPending(true);
                            setIsEmailVerified(false);
                        }
                    } catch (error) {
                        console.error("Error reloading user on auth state change:", error);
                        // Remain in pending state
                        setIsEmailVerificationPending(true);
                        setIsEmailVerified(false);
                    }
                } else if (user.emailVerified && isEmailVerificationPending) {
                     // User is verified, and we were in pending state. Finalize.
                     setIsEmailVerified(true);
                     setIsEmailVerificationPending(false);
                     // This handles cases where they verify and come back without clicking 'I have verified'
                     await saveUserData({ ...user, emailVerified: true }); 
                     toast({
                         title: "Email Verified!",
                         description: "Your email has been verified. Redirecting to login...",
                         variant: "default",
                         duration: 3000
                     });
                     // Sign out after successful verification and data save, then redirect
                     await signOut(auth);
                     navigate('/login');
                } else if (user.emailVerified && !isEmailVerificationPending) {
                    // User already verified (e.g., Google login or already verified via email/password previously)
                    // If this is a normal registration, they should not be on this page if verified.
                    // This scenario is more relevant if you reuse this component for login/signup
                    // For now, if they are already verified and signed in, redirect to dashboard.
                    // This might happen if they quickly verify and then refresh.
                    if (!isLoading && !isGoogleLoading) { // Prevent redirect during initial signup or Google signup
                        navigate('/dashboard'); 
                    }
                }
            } else {
                // User is signed out. If verification was pending, reset.
                if (isEmailVerificationPending) {
                    setIsEmailVerificationPending(false);
                    setIsEmailVerified(false);
                    setCurrentUserEmail(null);
                }
            }
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, [isEmailVerificationPending, isLoading, isGoogleLoading, navigate,  toast]); // Add dependencies

    const validateFile = (file: File): boolean => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        if (file.size > maxSize) {
            toast({
                title: "File too large",
                description: "Please select a file smaller than 5MB",
                variant: "destructive",
            });
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            toast({
                title: "Invalid file type",
                description: "Please select a JPG or PNG image file for OCR processing.",
                variant: "destructive",
            });
            return false;
        }

        return true;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setKycUpload({ file: null, processing: false, progress: 0, ocrText: null, isCompressing: false });
            return;
        }

        if (!validateFile(file)) {
            setKycUpload({ file: null, processing: false, progress: 0, ocrText: null, isCompressing: false });
            return;
        }

        let fileToProcess = file;
        setKycUpload(prev => ({ ...prev, file: file, processing: false, progress: 0, ocrText: null }));

        setKycUpload(prev => ({ ...prev, isCompressing: true }));
        toast({
            title: "Compressing Image",
            description: "Optimizing image for OCR processing...",
            duration: 3000,
        });

        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useExif: true,
            };
            fileToProcess = await imageCompression(file, options);
            console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
            console.log('Compressed file size:', (fileToProcess.size / 1024 / 1024).toFixed(2), 'MB');
            
            toast({
                title: "Image Compressed",
                description: "Image optimized successfully. Starting OCR...",
                duration: 1500,
            });
            setKycUpload(prev => ({ ...prev, file: fileToProcess, isCompressing: false }));
        } catch (error) {
            console.error('Image compression failed:', error);
            toast({
                title: "Compression Error",
                description: "Failed to compress image. Using original file for OCR.",
                variant: "destructive",
            });
            fileToProcess = file;
            setKycUpload(prev => ({ ...prev, isCompressing: false, file: file }));
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setKycUpload(prev => ({ ...prev, processing: true, progress: 0 }));
                toast({
                    title: "Processing Image",
                    description: "Extracting text from your document using OCR...",
                    duration: 3000
                });

                Tesseract.recognize(reader.result, 'eng', {
                    logger: (m) => {
                        if (m.status === 'recognizing text') {
                            setKycUpload(prev => ({ ...prev, progress: m.progress * 100 }));
                        }
                    },
                }).then(({ data: { text } }) => {
                    setKycUpload(prev => ({ ...prev, ocrText: text, progress: 100, processing: false }));
                    toast({
                        title: "OCR Complete",
                        description: "Text extracted from document successfully!",
                        duration: 2000
                    });
                    console.log('OCR Result:', text);
                }).catch(ocrError => {
                    console.error("OCR failed:", ocrError);
                    toast({
                        title: "OCR Error",
                        description: "Could not extract text from document. Please try with a clearer image.",
                        variant: "destructive",
                    });
                    setKycUpload(prev => ({ ...prev, ocrText: null, progress: 0, processing: false }));
                });
            }
        };
        reader.readAsDataURL(fileToProcess);
    };

    const saveUserData = async (user: any) => {
        try {
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name: name || user.displayName || 'N/A',
                email: user.email,
                mobile: mobile || 'N/A', // Mobile number might not be available from Google signup
                ocrExtractedText: kycUpload.ocrText || null,
                createdAt: new Date().toISOString(),
                emailVerified: user.emailVerified
            }, { merge: true });
            console.log("User data saved/updated in Firestore:", user.uid);
        } catch (error) {
            console.error('Error saving user data to Firestore:', error);
            toast({
                title: "Database Error",
                description: "Failed to save user data. Please contact support if this persists.",
                variant: "destructive",
            });
        }
    };

    const handleVerifyEmail = async () => {
        setIsLoading(true); // Indicate loading state for the check
        const user = auth.currentUser;
        if (user) {
            try {
                await reload(user); // Force refresh of user token and status
                if (user.emailVerified) {
                    setIsEmailVerified(true);
                    setIsEmailVerificationPending(false);
                    
                    // Save user data to Firestore now that email is verified
                    await saveUserData({ ...user, emailVerified: true });
                    
                    toast({
                        title: "Email Verified!",
                        description: "Your email has been verified. Redirecting to login...",
                        variant: "default",
                        duration: 3000
                    });
                    
                    // Sign out the user and redirect to login
                    // This ensures they have to log in with their now-verified account
                    await signOut(auth);
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                } else {
                    toast({
                        title: "Email Not Verified Yet",
                        description: "Please check your inbox (and spam folder) for the verification email. Click the link to verify.",
                        variant: "destructive",
                        duration: 5000,
                    });
                    // Keep the state as pending and verified false
                    setIsEmailVerificationPending(true);
                    setIsEmailVerified(false);
                }
            } catch (error: any) {
                console.error("Error reloading user or checking verification:", error);
                toast({
                    title: "Verification Check Failed",
                    description: "Could not check email verification status. Please ensure you are connected to the internet.",
                    variant: "destructive",
                });
                // If there's an error, assume it's not verified and stay on the page
                setIsEmailVerificationPending(true);
                setIsEmailVerified(false); // Make sure this is still false on error
            } finally {
                setIsLoading(false);
            }
        } else {
            // No user in session. Prompt them to register again or handle sign-in.
            toast({
                title: "Session Expired or No User",
                description: "Your session has ended. Please register again or log in if you already verified your email.",
                variant: "info",
                duration: 5000
            });
            // Reset state and potentially redirect to /register or /login
            setIsEmailVerificationPending(false);
            setIsEmailVerified(false);
            setCurrentUserEmail(null);
            // navigate('/register'); // Or handle this based on your app flow
        }
    };

    const handleResendVerificationEmail = async () => {
        setIsLoading(true);
        const user = auth.currentUser;
        if (user) {
            try {
                await sendEmailVerification(user);
                toast({
                    title: "Verification Email Sent",
                    description: "A new verification email has been sent to your inbox. Please check it.",
                    variant: "default",
                    duration: 5000
                });
            } catch (error: any) {
                console.error("Error resending verification email:", error);
                let errorMessage = "Failed to resend verification email. Please try again later.";
                if (error.code === 'auth/too-many-requests') {
                    errorMessage = "Too many requests. Please wait a moment and try again.";
                }
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        } else {
            toast({
                title: "No User Session",
                description: "Please register again to resend verification.",
                variant: "destructive",
            });
            setIsLoading(false);
            setIsEmailVerificationPending(false); // Reset in case session was lost
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !mobile || !password || !confirmPassword) {
            toast({
                title: "Error",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match.",
                variant: "destructive",
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: "Error",
                description: "Password must be at least 6 characters long.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: name
            });

            await sendEmailVerification(user);

            // Set state to indicate email verification is pending
            setIsEmailVerificationPending(true);
            setCurrentUserEmail(email); // Store the email for the pending message

            toast({
                title: "Registration Successful!",
                description: `Hi ${name}! Your account has been created. A verification email has been sent to ${email}. Please click the link in the email to verify.`,
                duration: 8000,
            });

            // Keep the user signed in, don't sign out here.
            // The useEffect listener will handle redirection upon verification,
            // or the user can manually click 'I have verified my email'.

        } catch (error: any) {
            let errorMessage = "Registration failed. Please try again.";

            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = "An account with this email already exists. Please login or use a different email.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "The email address is invalid. Please enter a valid one.";
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = "Email/password authentication is not enabled.";
                    break;
                case 'auth/weak-password':
                    errorMessage = "Password is too weak. Please choose a stronger password (at least 6 characters).";
                    break;
                default:
                    errorMessage = error.message || "An unexpected error occurred during registration.";
            }

            toast({
                title: "Registration Error",
                description: errorMessage,
                variant: "destructive",
                duration: 5000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setIsGoogleLoading(true);

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Google sign-up usually means email is already verified
            await saveUserData({ ...user, emailVerified: true }); 

            toast({
                title: "Account created successfully!",
                description: `Welcome to UNI-PAY, ${user.displayName || user.email}!`,
                duration: 3000
            });

            navigate('/dashboard');
        } catch (error: any) {
            let errorMessage = "Google signup failed. Please try again.";

            switch (error.code) {
                case 'auth/account-exists-with-different-credential':
                    errorMessage = "An account already exists with this email using a different sign-in method.";
                    break;
                case 'auth/cancelled-popup-request':
                case 'auth/popup-closed-by-user':
                    errorMessage = "Google signup cancelled. Please try again.";
                    break;
                case 'auth/unauthorized-domain':
                    errorMessage = "This domain is not authorized for Google sign-in.";
                    break;
                default:
                    errorMessage = error.message || "An unexpected error occurred during Google signup.";
            }

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
                duration: 5000
            });
        } finally {
            setIsGoogleLoading(false);
        }
    };

    // Disable the form if any heavy processing or verification is in progress
    const isFormDisabled = isLoading || isGoogleLoading || kycUpload.processing || kycUpload.isCompressing || isEmailVerificationPending;

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-gray-600 mt-1">Join UNI-PAY to start making digital payments</p>
            </div>

            {isEmailVerificationPending && !isEmailVerified ? (
                <div className="text-center p-4 border border-blue-200 bg-blue-50 rounded-md space-y-3">
                    <h3 className="text-xl font-semibold text-blue-800">Email Verification Pending</h3>
                    <p className="text-gray-700">
                        A verification link has been sent to <strong className="font-medium">{currentUserEmail || email}</strong>.
                        Please check your inbox (and spam folder) and click the link to verify your email.
                    </p>
                    <p className="text-sm text-gray-600">
                        Once you've clicked the link, return here and click the button below to complete registration.
                    </p>
                    <Button
                        className="w-full"
                        onClick={handleVerifyEmail}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Checking verification...
                            </div>
                        ) : (
                            "I have verified my email"
                        )}
                    </Button>
                    <Button
                        variant="link"
                        className="w-full text-blue-600"
                        onClick={handleResendVerificationEmail}
                        disabled={isLoading}
                    >
                        Resend Verification Email
                    </Button>
                </div>
            ) : (
                <>
                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={handleGoogleSignup}
                        disabled={isFormDisabled}
                    >
                        {isGoogleLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
                        ) : (
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                        )}
                        {isGoogleLoading ? "Creating account..." : "Continue with Google"}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isFormDisabled}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isFormDisabled}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mobile">Mobile Number *</Label>
                                <Input
                                    id="mobile"
                                    type="tel"
                                    placeholder="+1234567890"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    disabled={isFormDisabled}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isFormDisabled}
                                    required
                                />
                                <p className="text-xs text-gray-500">
                                    Password must be at least 6 characters long
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isFormDisabled}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kycDocs">Upload KYC Document for Text Extraction (Optional)</Label>
                                <Input
                                    id="kycDocs"
                                    type="file"
                                    className="cursor-pointer"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    disabled={isFormDisabled}
                                />
                                <p className="text-xs text-gray-500">
                                    Upload clear image of Aadhaar, PAN, or Driving License (JPG/PNG, max 5MB) for text extraction only
                                </p>

                                {kycUpload.file && (
                                    <div className="mt-2 p-2 bg-gray-50 rounded-md">
                                        <p className="text-sm text-gray-700 font-medium">
                                            Selected: {kycUpload.file.name}
                                            {kycUpload.file.size ? ` (${(kycUpload.file.size / 1024 / 1024).toFixed(2)} MB)` : ''}
                                        </p>
                                        {kycUpload.isCompressing && (
                                            <div className="mt-1 text-xs text-blue-600 flex items-center">
                                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-300 border-t-blue-600 mr-2"></div>
                                                Compressing image...
                                            </div>
                                        )}
                                        {kycUpload.processing && (
                                            <div className="mt-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${kycUpload.progress}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Extracting text... {Math.round(kycUpload.progress)}%
                                                </p>
                                            </div>
                                        )}
                                        {!kycUpload.processing && kycUpload.ocrText && (
                                            <div className="text-xs text-gray-600 mt-1">
                                                <p className="font-semibold mb-1 text-green-600">✓ Text extracted successfully:</p>
                                                <textarea
                                                    value={kycUpload.ocrText}
                                                    readOnly
                                                    className="w-full h-20 mt-1 p-1 border rounded-md resize-none bg-white text-gray-800"
                                                    aria-label="Extracted OCR text"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    This text will be saved with your account (document image is not stored)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <Button
                                className="w-full"
                                type="submit"
                                disabled={isFormDisabled}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Creating account...
                                    </div>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>

                            <p className="text-xs text-center text-gray-500">
                                By signing up, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default RegisterForm;