import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import User, { IUser } from '../models/User';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET!,
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.userId);
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    })
);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: '/api/auth/google/callback',
            passReqToCallback: true, // This is the new option
        },
        async (req, accessToken, refreshToken, profile, done) => { // req is the new first argument
            try {
                const isRegistering = req.query.state === 'register';

                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    // User already exists, log them in
                    user.googleAccessToken = accessToken;
                    user.googleRefreshToken = refreshToken;
                    await user.save();
                    return done(null, user);
                }

                user = await User.findOne({ email: profile.emails![0].value });

                if (user) {
                    // User with this email already exists, but not with Google
                    // Link the Google account
                    user.googleId = profile.id;
                    user.displayName = profile.displayName;
                    user.photoUrl = profile.photos![0].value;
                    user.isVerified = true;
                    user.googleAccessToken = accessToken;
                    user.googleRefreshToken = refreshToken;
                    await user.save();
                    return done(null, user);
                }

                if (isRegistering) {
                    // If registering, create a new user
                    const newUser = new User({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails![0].value,
                        photoUrl: profile.photos![0].value,
                        isVerified: true,
                        googleAccessToken: accessToken,
                        googleRefreshToken: refreshToken,
                    });
                    await newUser.save();
                    return done(null, newUser);
                } else {
                    // If logging in and user doesn't exist, fail
                    return done(null, false, { message: 'User not registered' });
                }
            } catch (error) {
                done(error, false);
            }
        }
    )
);

passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user || !user.password) {
                return done(null, false, { message: 'Invalid credentials' });
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return done(null, false, { message: 'Invalid credentials' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user as IUser);
    } catch (error) {
        done(error);
    }
});