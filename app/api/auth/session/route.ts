import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { parse } from "cookie";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // 1. Якщо accessToken ще валідний, просто повертаємо успіх
    if (accessToken) {
      return NextResponse.json({ success: true });
    }

    // 2. Якщо токена немає, але є refresh — оновлюємо сесію
    if (refreshToken) {
      // Згідно Swagger: метод POST, шлях /auth/refresh-session
      const apiRes = await api.post("/auth/refresh-session", {}, {
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      });

      const setCookie = apiRes.headers["set-cookie"];
      const response = NextResponse.json({ success: true }, { status: 200 });

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        cookieArray.forEach((cookieStr) => {
          const parsed = parse(cookieStr);
          
          // Визначаємо ім'я та значення куки
          // Бекенд зазвичай повертає куки у форматі "accessToken=value; ..."
          const name = parsed.accessToken ? "accessToken" : parsed.refreshToken ? "refreshToken" : Object.keys(parsed)[0];
          const value = parsed[name];

          if (name && value) {
            response.cookies.set(name, value, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              path: parsed.Path || "/",
              maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
              sameSite: "lax",
            });
          }
        });
        
        // 🔥 ВАЖЛИВО: повертаємо сформований response з новими куками
        return response;
      }
    }

    // 3. Якщо нічого не спрацювало — доступ заборонено
    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
    }
    return NextResponse.json({ success: false }, { status: 401 });
  }
}