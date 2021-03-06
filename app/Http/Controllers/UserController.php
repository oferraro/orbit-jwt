<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Contracts\Providers\Auth;
use Tymon\JWTAuth\Exceptions\JWTException;


class UserController extends Controller
{

    public function signUp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' =>   'required|',
            'string|',
            'min:8|',             // at least 8 characters
            'regex:/[A-Z]/',      // must contain at least one uppercase letter
            'regex:/[a-z]/',      // must contain at least one lowercase letter
            'regex:/[0-9]/',      // must contain at least one digit/number
            // this happens in frontend: 'confirmed',
            // Password (at least 8 characters, including 1 uppercase letter, 1 lowercase letter, and 1 number)
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user','token'),201);
    }

    /*
     * User login
     * */
    public function authenticate(Request $request)
    {
        // TODO: add refresh token to return data
        $validator = Validator::make($request->all(), [
            'email' => 'required|string',
            'password' => 'required|string'
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $credentials = $request->only('email', 'password');

        try {
            if (!$jwt = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 400);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        $refresh_token = $jwt;
        return response()->json(compact('jwt', 'refresh_token'), 201);
    }

    public function logout(Request $request) {
        $token = $request->get("refresh_token");
        $request->request->set('token', $token);
        JWTAuth::parseToken();
        JWTAuth::invalidate($token);
        return response()->json([], 204);
    }

    public function getAuthenticatedUser(Request $request)
    {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['token_absent'], $e->getStatusCode());
        }

        $default = "https://www.somewhere.com/homestar.jpg";
        $size = 40;
        $avatar_url = "https://www.gravatar.com/avatar/"
            . md5( strtolower( trim( $user->email ) ) )
            . "?d=" . urlencode( $default ) . "&s=" . $size;

        $responseUser = [
            "email" => $user->email,
            "name" => $user->name,
            "avatar_url" => $avatar_url
        ];
        return response()->json($responseUser);
    }

    public function refreshJWT(Request $request) {
        $validator = Validator::make($request->all(), [
            'refresh_token' => 'required|string'
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $token = $request->get("refresh_token");
        $request->request->set('token', $token);
        JWTAuth::parseToken();
        $jwt = JWTAuth::refresh($token);
        return response()->json(compact('jwt'));
    }

}
